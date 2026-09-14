import type { UploadedImage, StorageAuth } from "./storage-operations";

export type OperationAuth = StorageAuth;
export type OperationState = "pending" | "confirmed" | "cleaning";

async function rpc<T>(auth: OperationAuth, name: string, body: Record<string, unknown>): Promise<T> {
  const response = await auth.request(`/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`RPC ${name} (${response.status})`);
  return response.json() as Promise<T>;
}

export async function recoverOperation(auth: OperationAuth, operationId: string, garmentId: string) {
  return rpc<{ state: OperationState; result: unknown } | null>(auth, "wardrobe_operation_status", {
    p_operation_id: operationId,
    p_garment_id: garmentId,
  });
}

/**
 * Reserva atómicamente la limpieza. La RPC bloquea la operación y solo devuelve
 * rutas que siguen sin referencia; una confirmación ya no puede adelantarse.
 */
export async function reserveCleanup(auth: OperationAuth, operationId: string, garmentId: string) {
  return rpc<string[]>(auth, "wardrobe_abandon_operation", {
    p_operation_id: operationId,
    p_garment_id: garmentId,
  });
}

export function uploadManifest(images: UploadedImage[]) {
  return images.map(({ side, type, size }) => ({ side, type, size }));
}

export type Confirmation<T> =
  | { state: "confirmed"; result: T }
  | { state: "rejected"; error: string }
  | { state: "unknown"; error: string };

export async function confirmWithRecovery<T>(auth: OperationAuth, name: string, body: Record<string, unknown>, operationId: string, garmentId: string): Promise<Confirmation<T>> {
  let definitelyRejected = false;
  try {
    const response = await auth.request(`/rest/v1/rpc/${name}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    definitelyRejected = !response.ok && response.status < 500;
    if (definitelyRejected) return { state: "rejected", error: "La base de datos rechazó la operación." };
    if (response.ok) {
      try { return { state: "confirmed", result: await response.json() as T }; }
      catch { /* La transacción respondió correctamente, pero hay que recuperar su resultado. */ }
    }
  } catch { /* Un corte de comunicación no demuestra que la transacción fallase. */ }
  if (!definitelyRejected) {
    try {
      const recovered = await recoverOperation(auth, operationId, garmentId);
      if (recovered?.state === "confirmed") return { state: "confirmed", result: recovered.result as T };
    } catch { /* Conservamos los archivos mientras el resultado sea incierto. */ }
  }
  return { state: "unknown", error: "No se pudo comprobar si la operación quedó guardada." };
}

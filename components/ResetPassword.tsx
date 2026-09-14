"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
export function ResetPassword() {
  const router = useRouter(); const [ready,setReady]=useState(false); const [message,setMessage]=useState("");
  useEffect(()=>{ const hash=new URLSearchParams(location.hash.slice(1)); fetch("/api/auth/exchange",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({access_token:hash.get("access_token"),refresh_token:hash.get("refresh_token")})}).then(async response=>{if(!response.ok) throw new Error((await response.json()).error); history.replaceState(null,"",location.pathname); setReady(true)}).catch(error=>setMessage(error.message)); },[]);
  async function submit(event:FormEvent<HTMLFormElement>){ event.preventDefault(); const password=String(new FormData(event.currentTarget).get("password")); const response=await fetch("/api/auth/password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password})}); const body=await response.json(); if(!response.ok) return setMessage(body.error); router.push("/armario/salir"); }
  return <form className="auth-card" onSubmit={submit}><p className="eyebrow">Acceso privado</p><h1>Nueva contraseña</h1>{ready?<><label>Contraseña<input name="password" type="password" minLength={10} required autoComplete="new-password" /></label><button className="button">Guardar contraseña</button></>:<p>Validando el enlace…</p>}{message&&<p className="form-error" role="alert">{message}</p>}</form>;
}

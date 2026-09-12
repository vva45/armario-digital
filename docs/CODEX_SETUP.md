# Conectar este proyecto a Codex Cloud

## Estado y alcance

Estos archivos preparan el repositorio; no crean ni autentican un entorno de Codex. La conexión debe completarse en la cuenta del propietario. No hay una aplicación que instalar todavía, porque no existe `package.json`.

## Pasos en la cuenta

1. Abrir Codex Cloud e iniciar sesión con la cuenta de ChatGPT.
2. Conectar GitHub o revisar la conexión existente. Autorizar específicamente este repositorio si no aparece entre los accesibles.
3. Crear o seleccionar un entorno para `vva45/armario-digital`. Usar la configuración automática inicialmente; no pegar secretos de producción ni comandos `npm install` a ciegas.
4. Al iniciar la tarea, seleccionar la rama `setup/codex`, que contiene la especificación y las instrucciones. `main` solo contiene la inicialización hasta que el propietario revise y fusione la propuesta.
5. Adjuntar las tres referencias visuales originales directamente a la tarea si se quieren usar; no están publicadas en Git.

Codex toma el código de la rama o commit seleccionado. La documentación oficial describe configuración automática y scripts de preparación. Cuando haya un manifiesto de dependencias real, revisar su instalación y el lockfile. La primera creación del proyecto puede requerir acceso de red del agente al registro de paquetes y documentación oficial; conceder solo el acceso necesario, no permisos irrestrictos por defecto.

## Mensaje para comprobar la preparación sin construir todavía

```text
Lee AGENTS.md, docs/SPEC.md y docs/PLAN.md.
Confirma que estás en el repositorio vva45/armario-digital y que puedes leer
la especificación completa de la rama setup/codex.
Revisa las herramientas disponibles y propón el plan para la etapa 1.
No empieces a construir ni contratar servicios en esta tarea de comprobación.
No afirmes que has instalado la aplicación: aún no hay package.json.
```

## Cuando el propietario autorice la primera etapa

```text
Lee AGENTS.md, docs/SPEC.md y docs/PLAN.md.
Empieza la etapa 1 en una nueva rama basada en setup/codex.
Implementa y comprueba la base funcional del armario, respetando toda
la especificación. Entrega cambios revisables y los bloqueos reales.
No fusiones, no publiques y no actives servicios de pago.
```

## Documentación oficial

- Codex Cloud: https://developers.openai.com/codex/cloud/
- Entornos: https://developers.openai.com/codex/cloud/environments/
- AGENTS.md: https://developers.openai.com/codex/guides/agents-md/

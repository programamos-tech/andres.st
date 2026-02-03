# Backend: Tienda → Ticket de seguimiento y factura al dueño

## Objetivo

Cuando alguien (ej. **Wendy de Zonat**) agrega una funcionalidad desde la tienda y envía solicitudes:

1. Identificar **quién es** por su correo (el mismo con el que entra a la plataforma del cliente, ej. Zonat).
2. Saber **a qué cliente/negocio** pertenece (Zonat).
3. Crear un **ticket de seguimiento** por esa solicitud.
4. Para facturación: **facturar al dueño del negocio** (ej. **Diego**), no necesariamente a Wendy.

---

## Estado actual

- **Supabase:** `proyectos_maestros` (cliente/negocio), `actividad_centralizada` (logs con usuario_nombre, usuario_email, proyecto_id).
- **Tickets:** tipo `Ticket` en código (proyecto_id, creado_por_nombre, creado_por_email); hoy mock, no tabla en DB.
- **Tienda:** solicitudes en `localStorage`; botón "Enviar solicitudes" sin backend.

No existe hoy:

- Tabla de **usuarios por plataforma** (email → proyecto).
- Campo **dueño del negocio** (a quién facturar) en el proyecto.

---

## Cómo “conectarnos” con la DB de Zonat (y sus 5 tiendas)

**Importante:** Zonat tiene su **propia instancia de Supabase** (otra URL, otra base de datos). Nosotros **no** podemos abrir conexión directa desde nuestro backend a esa DB: son proyectos distintos, credenciales distintas, y no es buena práctica que andres.st tenga acceso directo a la base del cliente.

Por tanto, **no** hacemos `SELECT` contra la DB de Zonat desde nuestro código. En su lugar:

1. **Nuestra DB (andres.st / backstage)** es la **fuente de verdad** para la tienda:
   - Qué emails pertenecen a qué cliente (ej. Wendy → Zonat).
   - Quién es el dueño de cada cliente (ej. Diego para Zonat).
   - Las 5 tiendas de Zonat pueden ser solo **referencia** en nuestro lado (ej. en `proyectos_maestros` o en una tabla `tiendas` ligada al proyecto Zonat) si necesitas mostrar “tienda X de Zonat” en el ticket. Los datos “vivos” (inventario, ventas, etc.) siguen en la DB de Zonat; nosotros solo guardamos lo necesario para tickets y facturación.

2. **De dónde sale la lista de usuarios (Wendy, Diego, etc.)**  
   Esa información la tenemos **en nuestra DB**, no leyendo en tiempo real la de Zonat. Opciones para llenar nuestra tabla `usuarios_plataforma` (y dueño en `proyectos_maestros`):

---

### Opción A – API en la instancia de Zonat (recomendada si Zonat tiene backend)

- En el **proyecto/app de Zonat** (su Supabase o su app Next/Node) exponés un endpoint que **sí** puede leer su DB, por ejemplo:
  - `GET /api/usuarios-para-andres` (o nombre similar), protegido con un **API key compartido** o secret que solo vos y tu backend conocen.
- Ese endpoint devuelve algo como: lista de usuarios (email, nombre, tienda_id si aplica, si es dueño o no).
- **Nuestro backend (andres.st)** llama a esa URL (por ejemplo desde un job periódico o al “sincronizar” desde backstage), recibe la lista y **actualiza nuestra tabla `usuarios_plataforma`** y el dueño en `proyectos_maestros`.
- Ventaja: los datos de usuarios y tiendas siguen en Zonat; nosotros solo guardamos una **copia mínima** para identificar a Wendy y facturar a Diego. No necesitamos credenciales de la DB de Zonat en andres.st.

Resumen: **no nos conectamos a la DB de Zonat**; nos conectamos a **un API que corre en el entorno de Zonat** y que sí puede leer su DB.

---

### Opción B – Webhook: Zonat nos avisa cuando crean/editan usuarios

- En la app de Zonat, cuando crean o modifican un usuario (o el dueño), disparan un **webhook** a nuestro backend (ej. `POST https://andres.st/api/webhooks/zonat-usuarios`).
- El body trae email, nombre, si es dueño, tienda, etc. Nosotros actualizamos `usuarios_plataforma` y `proyectos_maestros.dueño_*`.
- La lista de usuarios y tiendas se mantiene al día sin que nosotros toquemos la DB de Zonat.

---

### Opción C – Carga manual o import desde backstage

- Sin tocar la instancia de Zonat: alguien (vos o el cliente) exporta desde Zonat la lista de usuarios (CSV o similar) o la carga a mano en backstage.
- En andres.st tenés una pantalla “Usuarios de Zonat” donde se importa o se dan de alta Wendy, Diego, qué tienda, quién es dueño, etc. Todo se guarda en **nuestra** DB.
- No hay conexión técnica con la DB de Zonat; la “conexión” es humana + export/import.

---

### Las 5 tiendas de Zonat

- Si solo necesitás “saber que es Zonat” para el ticket y la factura, con tener **un** proyecto “Zonat” y el dueño (Diego) puede alcanzar.
- Si querés que el ticket diga “Tienda Centro” vs “Tienda Norte”, etc., en **nuestra** DB podés tener una tabla `tiendas` (o `locales`): `id`, `proyecto_id`, `nombre`, y opcional `id_externo` (el id en la DB de Zonat por si algún día sincronizás). Esa tabla la llenás con la misma lógica: API de Zonat, webhook o import. No hace falta conectarnos directo a la DB de Zonat.

---

### Resumen

| Pregunta | Respuesta |
|----------|-----------|
| ¿Nos conectamos a la DB de Zonat? | **No.** Son otra instancia Supabase. |
| ¿Dónde está “Wendy es de Zonat” y “facturar a Diego”? | En **nuestra** DB (`usuarios_plataforma` + `proyectos_maestros.dueño_*`). |
| ¿Cómo llegan esos datos a nuestra DB? | API en Zonat que nosotros llamamos, webhook que Zonat dispara, o carga/import manual. |
| ¿Las 5 tiendas? | Opcional: tabla en nuestra DB, llenada por el mismo mecanismo (API/webhook/import). |

---

## Pasos a seguir

### 1. Modelo de datos (Supabase)

#### 1.1 Dueño / facturación por proyecto

En **`proyectos_maestros`** (o vista/join que uses):

- Añadir (o tener ya) algo como:
  - **`dueño_nombre`** (ej. "Diego")
  - **`dueño_email`** (opcional, para envío de factura)

Así cada proyecto tiene claro “a nombre de quién” se factura.

#### 1.2 Usuarios de cada plataforma

Tienes dos opciones:

**Opción A – Tabla `usuarios_plataforma`**

- `id`, `proyecto_id`, `email`, `nombre`, `es_dueño` (boolean).
- Wendy: proyecto Zonat, wendy@zonat.com, "Wendy", es_dueño = false.
- Diego: proyecto Zonat, diego@zonat.com, "Diego", es_dueño = true.
- Buscar por `email` → obtienes proyecto y, si quieres, quién es el dueño (es_dueño = true para ese proyecto).

**Opción B – Derivar de actividad**

- Sin nueva tabla: desde `actividad_centralizada` tomar pares distintos `(usuario_email, proyecto_id)` (y opcionalmente último `usuario_nombre`).
- Para “dueño”: guardarlo en `proyectos_maestros` (dueño_nombre / dueño_email).
- Limitación: solo conoces usuarios que ya generaron actividad.

Recomendación: **Opción A** si quieres que “Wendy” pueda enviar solicitudes aunque aún no haya generado actividad en Zonat (ej. primer uso desde la tienda).

#### 1.3 Tickets de tienda en DB

- Crear tabla **`tickets`** (o reutilizar la que tengas) con al menos:
  - `proyecto_id`, `proyecto_nombre`
  - `creado_por_nombre`, `creado_por_email` (quien pidió: Wendy)
  - `facturar_a_nombre` (dueño: Diego) — puede ser campo o derivado del proyecto
  - `modulo` / `tienda` / `titulo` / `descripcion` / `estado`
  - Items: tabla **`ticket_items`** (ticket_id, producto_id o id de funcionalidad de la tienda) para “qué agregó a la solicitud”.

O un solo ticket por “envío de solicitudes” con un JSON/array de ítems (productos de la tienda).

---

### 2. Flujo en la app

1. **Pantalla “Enviar solicitudes” (tienda)**  
   - Pedir **correo** (y opcionalmente nombre para mostrar: “Wendy de Zonat”).
   - El correo debe ser el **mismo con el que la persona entra a la plataforma del cliente** (ej. Zonat).

2. **Al enviar:**
   - Llamar API con: `email`, lista de `producto_id` (ids de la tienda, ej. `rep-ventas`, `dashboard`).
   - Backend:
     - Busca en **usuarios_plataforma** (o actividad) por `email`.
     - Obtiene `proyecto_id` (y opcionalmente proyecto completo).
     - Obtiene dueño del negocio (desde `proyectos_maestros.dueño_*` o usuario con `es_dueño = true`).
     - Crea **ticket** con:
       - creado_por = Wendy (nombre + email),
       - facturar_a = Diego (dueño),
       - ítems = funcionalidades solicitadas.
     - Devuelve éxito / id de ticket.

3. **Factura**  
   - En tu proceso de facturación usas `facturar_a_nombre` (Diego) del ticket (o del proyecto), no el email de Wendy.

---

### 3. Endpoints sugeridos

| Método | Ruta | Uso |
|--------|------|-----|
| GET | `/api/tienda/clientes` o `/api/tienda/proyectos` | Listar clientes/negocios (para mostrar “Zonat”, “Aleya”, etc.) si lo necesitas en UI. |
| GET | `/api/tienda/usuarios?proyecto_id=...` o `?email=...` | Listar usuarios de un proyecto o buscar usuario por email (para autocompletar “Wendy de Zonat”). |
| POST | `/api/tienda/solicitudes` | Body: `{ email, items: [ "rep-ventas", "dashboard", ... ] }`. Crea ticket y devuelve id. |

El POST sería el que:

- Resuelve usuario por email.
- Resuelve proyecto y dueño.
- Crea el ticket (y ítems) en DB.

---

### 4. Orden sugerido de implementación

1. **DB:** Añadir `dueño_nombre` (y si quieres `dueño_email`) a `proyectos_maestros`. Crear tabla `usuarios_plataforma` si eliges Opción A.
2. **DB:** Crear tabla `tickets` (y `ticket_items` o estructura de ítems) si aún no está en Supabase.
3. **API:** POST `/api/tienda/solicitudes`: recibir email + items, buscar usuario → proyecto → dueño, crear ticket.
4. **API (opcional):** GET para listar clientes y/o usuarios (para dropdown/autocompletar).
5. **Front:** En el panel “Enviar solicitudes” de la tienda: campo email (y opcional nombre), al enviar llamar POST con los ids que ya tienes en `localStorage`; mostrar éxito o error.

Cuando quieras, el siguiente paso puede ser: definir exactamente las columnas de `usuarios_plataforma` y `tickets` en Supabase y el cuerpo del POST `/api/tienda/solicitudes`.

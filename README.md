# WooCommerce Proxy (Node + Express + TypeScript)

Proxy ligero en **Node + Express + TypeScript** para consumir **WooCommerce REST API** desde un frontend, evitando exponer credenciales en el cliente.

Incluye:
- Basic Auth hacia WooCommerce (Consumer Key/Secret)
- Endpoints para productos, variaciones y checkout
- CORS configurable
- Manejo centralizado de errores (AxiosError)
- TypeScript estricto + validación mínima del checkout

---

## Requisitos

- Node.js **20 LTS** o **22 LTS** recomendado
- npm (o tu gestor preferido)

---

## Instalación

```bash
npm install

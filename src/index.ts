// file: src/index.ts
import { createApp } from "./app";
import { config } from "./config/env";

const app = createApp();

app.listen(config.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`✅ Proxy TS corriendo en http://localhost:${config.PORT}`);
});

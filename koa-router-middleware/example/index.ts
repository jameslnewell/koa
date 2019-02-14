import * as Koa from "koa";
import api from "./routes/api";

new Koa().use("/api", api).listen(() => {
  console.log("server started");
});

import { hostname } from "node:os";
import { createConsola } from "consola";
import { LokiReporter } from "../src";

const consola = createConsola({
  reporters: [
    new LokiReporter({
      baseUrl: "your base url here",
      user: "123456",
      token: "glc_......",
      labels: {
        hostname: hostname(),
      },
    }),
  ],
});

consola.log("Test Log");
consola.info("Test Info");
consola.success("Test Success");
consola.warn("Test Warn");
consola.error("Test Error");

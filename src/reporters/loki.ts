import { $fetch, FetchError } from "ofetch";
import type { LogObject, ConsolaReporter } from "consola";
import type { LokiOptions } from "../index";

// Mapping from consola log levels to loki log levels
const LogLevel = {
  0: "error",
  1: "warn",
  2: "log",
  3: "info",
  4: "debug",
  5: "trace",
} as const;

type LogEntry = {
  labels: Record<string, string | number>;
  entries: {
    timestamp: Date;
    message: string | undefined;
  }[];
};

export class LokiReporter implements ConsolaReporter {
  private buffer: LogEntry[] = [];
  private interval?: NodeJS.Timeout = undefined;
  private options: LokiOptions;

  constructor(lokiOptions: LokiOptions) {
    this.options = lokiOptions;
  }

  public async flush() {
    try {
      const headers: HeadersInit = {};

      if (this.options.user && this.options.token) {
        headers.Authorization = `Basic ${Buffer.from(`${this.options.user}:${this.options.token}`).toString("base64")}`;
      }

      await $fetch("/loki/api/v1/push", {
        baseURL: this.options.baseURL,
        method: "POST",
        headers,
        body: {
          streams: this.buffer.map((logStream) => ({
            stream: logStream.labels,
            values: logStream.entries.map((entry) => [
              JSON.stringify(entry.timestamp.getTime() * 1000 * 1000), // Loki expects nanoseconds
              entry.message,
            ]),
          })),
        },
      });

      this.buffer = [];
    } catch (error) {
      if (error instanceof FetchError) {
        if (error.data) {
          console.error(`error pushing logs to loki: ${error.data}`);
        } else {
          console.error(error);
        }
      }
    }
  }

  public log(logObj: LogObject) {
    if (!this.interval) {
      this.interval = setInterval(() => {
        if (this.buffer.length > 0) {
          this.flush();
        }
      }, 5000);
    }

    const defaultLabels = {
      level: LogLevel[logObj.level as keyof typeof LogLevel],
    };

    this.buffer.push({
      labels: Object.assign({}, defaultLabels, this.options.labels),
      entries: [
        {
          timestamp: logObj.date,
          message: logObj.args[0],
        },
      ],
    });
  }
}

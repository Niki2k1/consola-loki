export { LokiReporter } from "./reporters/loki";

export interface LokiOptions {
  baseURL: string;
  user?: string;
  token?: string;
  labels?: Record<string, string>;
}

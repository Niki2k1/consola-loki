export { LokiReporter } from "./reporters/loki";

export interface LokiOptions {
  baseURL: string;
  interval?: number;
  user?: string;
  password?: string;
  labels?: Record<string, string>;
}

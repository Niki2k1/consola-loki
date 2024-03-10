import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createConsola } from "consola";
import { $fetch } from "ofetch";
import { LokiReporter } from "../src";

const mocks = vi.hoisted(() => {
  return {
    $fetch: vi.fn(),
  };
});

vi.mock("ofetch", () => {
  return {
    $fetch: mocks.$fetch,
  };
});

describe("consola-loki", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should log to loki", async () => {
    const date = new Date(2024, 3, 8, 14, 38);
    vi.setSystemTime(date);

    vi.mocked($fetch).mockResolvedValue(() => {});

    const baseURL = "https://loki-endpoint.example";

    const lokiReporter = new LokiReporter({
      baseURL,
      user: "123456",
      password: "glc_",
    });

    const consola = createConsola({
      reporters: [lokiReporter],
    });

    consola.warn("Test Warn");
    consola.error("Test Error");

    // flush manually
    await lokiReporter.flush();

    const timestmap = (date.getTime() * 1000 * 1000).toString();

    expect($fetch).toHaveBeenCalledWith("/loki/api/v1/push", {
      baseURL,
      body: {
        streams: [
          {
            stream: {
              level: "warn",
            },
            values: [[timestmap, "Test Warn"]],
          },
          {
            stream: {
              level: "error",
            },
            values: [[timestmap, "Test Error"]],
          },
        ],
      },
      headers: {
        Authorization: "Basic MTIzNDU2OmdsY18=",
      },
      method: "POST",
    });
  });
});

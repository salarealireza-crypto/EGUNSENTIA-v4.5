import { createServerFn } from "@tanstack/react-start";
import { assertSameSiteRequest } from "../auth/isolation.server";

export type ConnectorReadiness = { ready: boolean };

export const getConnectorReadiness = createServerFn({ method: "POST" }).handler(
  async (): Promise<ConnectorReadiness> => {
    assertSameSiteRequest();
    const { isConnectorTokenReady } = await import("./client.server.ts");
    return { ready: isConnectorTokenReady() };
  },
);

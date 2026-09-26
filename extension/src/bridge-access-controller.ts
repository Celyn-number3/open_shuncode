import * as vscode from "vscode";
import type { BridgeManager, BridgeStatus } from "./bridge-server.js";

/**
 * Access snapshot consumed by the Bridge settings page.
 *
 * The open-source edition has no license, activation or payment service, so
 * Bridge access is always granted locally and no network call is made. The
 * shape is kept so the existing settings page keeps rendering correctly.
 */
export interface BridgeAccessSnapshot {
  readonly serverConfigured: boolean;
  readonly signedIn: boolean;
  readonly installationId: string;
  readonly githubUserId: string;
  readonly githubLogin: string;
  readonly giteeUserId: string;
  readonly giteeLogin: string;
  readonly email: string;
  readonly avatarUrl: string;
  readonly licensed: boolean;
  readonly expiresAt: string;
  readonly permanent: boolean;
  readonly error: string;
  readonly plans: readonly never[];
  readonly paymentTypes: readonly string[];
  readonly plansError: string;
  readonly paymentOrder: Readonly<Record<
    "id" | "status" | "checkoutUrl" | "planId" | "planName" | "amount" | "paymentType"
    | "createdAt" | "expiresAt" | "paidAt" | "entitlementExpiresAt" | "error",
    string
  >>;
}

const OPEN_ACCESS: BridgeAccessSnapshot = Object.freeze({
  serverConfigured: true,
  signedIn: false,
  installationId: "",
  githubUserId: "",
  githubLogin: "",
  giteeUserId: "",
  giteeLogin: "",
  email: "",
  avatarUrl: "",
  licensed: true,
  expiresAt: "",
  permanent: true,
  error: "",
  plans: [],
  paymentTypes: [],
  plansError: "",
  paymentOrder: Object.freeze({
    id: "", status: "", checkoutUrl: "", planId: "", planName: "", amount: "",
    paymentType: "", createdAt: "", expiresAt: "", paidAt: "", entitlementExpiresAt: "", error: "",
  }),
});

export class BridgeAccessController implements vscode.Disposable {
  constructor(private readonly bridge: BridgeManager) {}

  async start(domain?: string): Promise<BridgeStatus> {
    return await this.bridge.start(domain);
  }

  async stop(): Promise<BridgeStatus> {
    return await this.bridge.stop();
  }

  async getAccessStatus(): Promise<BridgeAccessSnapshot> {
    return OPEN_ACCESS;
  }

  dispose(): void {}
}

// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { ReadBuffer, serializeMessage } from "./src-CX2iR2pK.mjs";
import { import_node_process } from "./shimsNode.mjs";
// node_modules/@modelcontextprotocol/server/dist/stdio.mjs
var StdioServerTransport = class {
  _readBuffer;
  _started = false;
  _closed = false;
  constructor(_stdin = import_node_process.default.stdin, _stdout = import_node_process.default.stdout, options) {
    this._stdin = _stdin;
    this._stdout = _stdout;
    this._readBuffer = new ReadBuffer({
      maxBufferSize: options?.maxBufferSize
    });
  }
  onclose;
  onerror;
  onmessage;
  _ondata = chunk => {
    try {
      this._readBuffer.append(chunk);
      this.processReadBuffer();
    } catch (error51) {
      this.onerror?.(error51);
      this.close().catch(() => {});
    }
  };
  _onerror = error51 => {
    this.onerror?.(error51);
  };
  _onstdouterror = error51 => {
    this.onerror?.(error51);
    this.close().catch(() => {});
  };
  /**
  * Starts listening for messages on `stdin`.
  */
  async start() {
    if (this._started) throw new Error("StdioServerTransport already started! If using Server class, note that connect() calls start() automatically.");
    this._started = true;
    this._stdin.on("data", this._ondata);
    this._stdin.on("error", this._onerror);
    this._stdout.on("error", this._onstdouterror);
  }
  processReadBuffer() {
    while (true) try {
      const message = this._readBuffer.readMessage();
      if (message === null) break;
      this.onmessage?.(message);
    } catch (error51) {
      this.onerror?.(error51);
    }
  }
  async close() {
    if (this._closed) return;
    this._closed = true;
    this._stdin.off("data", this._ondata);
    this._stdin.off("error", this._onerror);
    this._stdout.off("error", this._onstdouterror);
    if (this._stdin.listenerCount("data") === 0) this._stdin.pause();
    this._readBuffer.clear();
    this.onclose?.();
  }
  send(message) {
    if (this._closed) return Promise.reject(/* @__PURE__ */new Error("StdioServerTransport is closed"));
    return new Promise((resolve, reject) => {
      const json2 = serializeMessage(message);
      let settled = false;
      const onError = error51 => {
        if (settled) return;
        settled = true;
        this._stdout.off("error", onError);
        this._stdout.off("drain", onDrain);
        reject(error51);
      };
      const onDrain = () => {
        if (settled) return;
        settled = true;
        this._stdout.off("error", onError);
        this._stdout.off("drain", onDrain);
        resolve();
      };
      this._stdout.once("error", onError);
      if (this._stdout.write(json2)) {
        if (settled) return;
        settled = true;
        this._stdout.off("error", onError);
        resolve();
      } else if (!settled) this._stdout.once("drain", onDrain);
    });
  }
};

// src/apply-patch.ts
export { StdioServerTransport };

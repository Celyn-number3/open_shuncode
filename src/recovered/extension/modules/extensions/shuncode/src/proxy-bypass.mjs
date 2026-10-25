// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
// extensions/shuncode/src/proxy-bypass.mts
init_define_SHUNCODE_BUILD_INFO();
var import_node_net = require("node:net");
function canonicalHost(value) {
  const host = value.toLowerCase().replace(/^\[|\]$/g, "").replace(/\.$/, "");
  if ((0, import_node_net.isIP)(host) === 6) {
    try {
      return new URL(`http://[${host}]/`).hostname.slice(1, -1);
    } catch {
      return host;
    }
  }
  return host;
}
function matchesProxyBypass(target, raw, subdomains = true) {
  let rule = raw.trim().toLowerCase();
  if (!rule) return false;
  const host = canonicalHost(target.hostname);
  if (rule === "*") return true;
  if (rule === "<local>") return !host.includes(".") && !host.includes(":");
  const cidr = rule.match(/^(.+)\/(\d{1,3})$/);
  if (cidr) {
    const network = canonicalHost(cidr[1]);
    const family = (0, import_node_net.isIP)(network);
    if (!family || (0, import_node_net.isIP)(host) !== family) return false;
    try {
      const list = new import_node_net.BlockList();
      list.addSubnet(network, Number(cidr[2]), family === 6 ? "ipv6" : "ipv4");
      return list.check(host, family === 6 ? "ipv6" : "ipv4");
    } catch {
      return false;
    }
  }
  let port;
  if (rule.startsWith("[")) {
    const match = rule.match(/^\[([^\]]+)\](?::(\d+))?$/);
    if (!match) return false;
    rule = match[1];
    port = match[2];
  } else if ((rule.match(/:/g) ?? []).length === 1) {
    const match = rule.match(/^([^:]+):(\d+)$/);
    if (!match) return false;
    rule = match[1];
    port = match[2];
  }
  if (port !== void 0) {
    const number4 = Number(port);
    if (!Number.isInteger(number4) || number4 < 1 || number4 > 65535) return false;
    const effectivePort = target.port || {
      "https:": "443",
      "wss:": "443",
      "http:": "80",
      "ws:": "80"
    }[target.protocol];
    if (Number(effectivePort) !== number4) return false;
  }
  rule = canonicalHost(rule);
  if ((0, import_node_net.isIP)(rule)) return host === rule;
  if (rule.includes(":")) return false;
  if (rule.startsWith("*.")) rule = rule.slice(1);
  if (rule.startsWith(".")) {
    const domain = rule.slice(1);
    return Boolean(domain) && (host === domain || host.endsWith(`.${domain}`));
  }
  if (rule.includes("*")) {
    const pattern = rule.split("*").map(part => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*");
    return new RegExp(`^${pattern}$`).test(host);
  }
  return host === rule || subdomains && !(0, import_node_net.isIP)(host) && host.endsWith(`.${rule}`);
}
function matchesNoProxy(target, value) {
  return Boolean(value?.split(/[;,]/).some(rule => matchesProxyBypass(target, rule)));
}
function isPacUrl(value) {
  if (!value?.trim()) return false;
  try {
    const url2 = new URL(value.trim().replace(/^pac\+/, ""));
    return ["http:", "https:"].includes(url2.protocol) && (/^pac\+/i.test(value.trim()) || /\.(?:pac|dat)$/i.test(url2.pathname));
  } catch {
    return false;
  }
}
function pacConfigurationError() {
  return new Error("PAC configuration is not a forward proxy endpoint. Configure the PAC URL in system proxy settings and use the Electron system transport, or supply an HTTP/SOCKS5 proxy endpoint for Node-only requests. No automatic proxy/direct fallback was attempted.");
}

// extensions/shuncode/src/extension-host-proxy.mts
export { import_node_net, canonicalHost, matchesProxyBypass, matchesNoProxy, isPacUrl, pacConfigurationError };

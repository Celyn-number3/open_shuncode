// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { joinValues, parsedType, stringifyPrimitive } from "../core/util.mjs";
// node_modules/zod/v4/locales/ro.js
var error37 = () => {
  const Sizable = {
    string: {
      unit: "caractere",
      verb: "s\u0103 aib\u0103"
    },
    file: {
      unit: "octe\u021Bi",
      verb: "s\u0103 aib\u0103"
    },
    array: {
      unit: "elemente",
      verb: "s\u0103 aib\u0103"
    },
    set: {
      unit: "elemente",
      verb: "s\u0103 aib\u0103"
    },
    map: {
      unit: "intr\u0103ri",
      verb: "s\u0103 aib\u0103"
    }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "intrare",
    email: "adres\u0103 de email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "dat\u0103 \u0219i or\u0103 ISO",
    date: "dat\u0103 ISO",
    time: "or\u0103 ISO",
    duration: "durat\u0103 ISO",
    ipv4: "adres\u0103 IPv4",
    ipv6: "adres\u0103 IPv6",
    mac: "adres\u0103 MAC",
    cidrv4: "interval IPv4",
    cidrv6: "interval IPv6",
    base64: "\u0219ir codat base64",
    base64url: "\u0219ir codat base64url",
    json_string: "\u0219ir JSON",
    e164: "num\u0103r E.164",
    jwt: "JWT",
    template_literal: "intrare"
  };
  const TypeDictionary = {
    nan: "NaN",
    string: "\u0219ir",
    number: "num\u0103r",
    boolean: "boolean",
    function: "func\u021Bie",
    array: "matrice",
    object: "obiect",
    undefined: "nedefinit",
    symbol: "simbol",
    bigint: "num\u0103r mare",
    void: "void",
    never: "never",
    map: "hart\u0103",
    set: "set"
  };
  return issue2 => {
    switch (issue2.code) {
      case "invalid_type":
        {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          return `Intrare invalid\u0103: a\u0219teptat ${expected}, primit ${received}`;
        }
      case "invalid_value":
        if (issue2.values.length === 1) return `Intrare invalid\u0103: a\u0219teptat ${stringifyPrimitive(issue2.values[0])}`;
        return `Op\u021Biune invalid\u0103: a\u0219teptat una dintre ${joinValues(issue2.values, "|")}`;
      case "too_big":
        {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          if (sizing) return `Prea mare: a\u0219teptat ca ${issue2.origin ?? "valoarea"} ${sizing.verb} ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elemente"}`;
          return `Prea mare: a\u0219teptat ca ${issue2.origin ?? "valoarea"} s\u0103 fie ${adj}${issue2.maximum.toString()}`;
        }
      case "too_small":
        {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          if (sizing) {
            return `Prea mic: a\u0219teptat ca ${issue2.origin} ${sizing.verb} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `Prea mic: a\u0219teptat ca ${issue2.origin} s\u0103 fie ${adj}${issue2.minimum.toString()}`;
        }
      case "invalid_format":
        {
          const _issue = issue2;
          if (_issue.format === "starts_with") {
            return `\u0218ir invalid: trebuie s\u0103 \xEEnceap\u0103 cu "${_issue.prefix}"`;
          }
          if (_issue.format === "ends_with") return `\u0218ir invalid: trebuie s\u0103 se termine cu "${_issue.suffix}"`;
          if (_issue.format === "includes") return `\u0218ir invalid: trebuie s\u0103 includ\u0103 "${_issue.includes}"`;
          if (_issue.format === "regex") return `\u0218ir invalid: trebuie s\u0103 se potriveasc\u0103 cu modelul ${_issue.pattern}`;
          return `Format invalid: ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
      case "not_multiple_of":
        return `Num\u0103r invalid: trebuie s\u0103 fie multiplu de ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Chei nerecunoscute: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Cheie invalid\u0103 \xEEn ${issue2.origin}`;
      case "invalid_union":
        return "Intrare invalid\u0103";
      case "invalid_element":
        return `Valoare invalid\u0103 \xEEn ${issue2.origin}`;
      default:
        return `Intrare invalid\u0103`;
    }
  };
};
function ro_default() {
  return {
    localeError: error37()
  };
}

// node_modules/zod/v4/locales/ru.js
export { error37, ro_default };

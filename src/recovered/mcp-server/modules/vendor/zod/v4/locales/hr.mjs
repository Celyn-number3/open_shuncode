// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { joinValues, parsedType, stringifyPrimitive } from "../core/util.mjs";
// node_modules/zod/v4/locales/hr.js
var error18 = () => {
  const Sizable = {
    string: {
      unit: "znakova",
      verb: "imati"
    },
    file: {
      unit: "bajtova",
      verb: "imati"
    },
    array: {
      unit: "stavki",
      verb: "imati"
    },
    set: {
      unit: "stavki",
      verb: "imati"
    }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "unos",
    email: "email adresa",
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
    datetime: "ISO datum i vrijeme",
    date: "ISO datum",
    time: "ISO vrijeme",
    duration: "ISO trajanje",
    ipv4: "IPv4 adresa",
    ipv6: "IPv6 adresa",
    cidrv4: "IPv4 raspon",
    cidrv6: "IPv6 raspon",
    base64: "base64 kodirani tekst",
    base64url: "base64url kodirani tekst",
    json_string: "JSON tekst",
    e164: "E.164 broj",
    jwt: "JWT",
    template_literal: "unos"
  };
  const TypeDictionary = {
    nan: "NaN",
    string: "tekst",
    number: "broj",
    boolean: "boolean",
    array: "niz",
    object: "objekt",
    set: "skup",
    file: "datoteka",
    date: "datum",
    bigint: "bigint",
    symbol: "simbol",
    undefined: "undefined",
    null: "null",
    function: "funkcija",
    map: "mapa"
  };
  return issue2 => {
    switch (issue2.code) {
      case "invalid_type":
        {
          const expected = TypeDictionary[issue2.expected] ?? issue2.expected;
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `Neispravan unos: o\u010Dekuje se instanceof ${issue2.expected}, a primljeno je ${received}`;
          }
          return `Neispravan unos: o\u010Dekuje se ${expected}, a primljeno je ${received}`;
        }
      case "invalid_value":
        if (issue2.values.length === 1) return `Neispravna vrijednost: o\u010Dekivano ${stringifyPrimitive(issue2.values[0])}`;
        return `Neispravna opcija: o\u010Dekivano jedno od ${joinValues(issue2.values, "|")}`;
      case "too_big":
        {
          const adj = issue2.inclusive ? "<=" : "<";
          const sizing = getSizing(issue2.origin);
          const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
          if (sizing) return `Preveliko: o\u010Dekivano da ${origin ?? "vrijednost"} ima ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elemenata"}`;
          return `Preveliko: o\u010Dekivano da ${origin ?? "vrijednost"} bude ${adj}${issue2.maximum.toString()}`;
        }
      case "too_small":
        {
          const adj = issue2.inclusive ? ">=" : ">";
          const sizing = getSizing(issue2.origin);
          const origin = TypeDictionary[issue2.origin] ?? issue2.origin;
          if (sizing) {
            return `Premalo: o\u010Dekivano da ${origin} ima ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `Premalo: o\u010Dekivano da ${origin} bude ${adj}${issue2.minimum.toString()}`;
        }
      case "invalid_format":
        {
          const _issue = issue2;
          if (_issue.format === "starts_with") return `Neispravan tekst: mora zapo\u010Dinjati s "${_issue.prefix}"`;
          if (_issue.format === "ends_with") return `Neispravan tekst: mora zavr\u0161avati s "${_issue.suffix}"`;
          if (_issue.format === "includes") return `Neispravan tekst: mora sadr\u017Eavati "${_issue.includes}"`;
          if (_issue.format === "regex") return `Neispravan tekst: mora odgovarati uzorku ${_issue.pattern}`;
          return `Neispravna ${FormatDictionary[_issue.format] ?? issue2.format}`;
        }
      case "not_multiple_of":
        return `Neispravan broj: mora biti vi\u0161ekratnik od ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Neprepoznat${issue2.keys.length > 1 ? "i klju\u010Devi" : " klju\u010D"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Neispravan klju\u010D u ${TypeDictionary[issue2.origin] ?? issue2.origin}`;
      case "invalid_union":
        return "Neispravan unos";
      case "invalid_element":
        return `Neispravna vrijednost u ${TypeDictionary[issue2.origin] ?? issue2.origin}`;
      default:
        return `Neispravan unos`;
    }
  };
};
function hr_default() {
  return {
    localeError: error18()
  };
}

// node_modules/zod/v4/locales/hu.js
export { error18, hr_default };

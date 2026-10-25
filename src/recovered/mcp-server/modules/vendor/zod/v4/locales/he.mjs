// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { joinValues, parsedType, stringifyPrimitive } from "../core/util.mjs";
// node_modules/zod/v4/locales/he.js
var error17 = () => {
  const TypeNames = {
    string: {
      label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA",
      gender: "f"
    },
    number: {
      label: "\u05DE\u05E1\u05E4\u05E8",
      gender: "m"
    },
    boolean: {
      label: "\u05E2\u05E8\u05DA \u05D1\u05D5\u05DC\u05D9\u05D0\u05E0\u05D9",
      gender: "m"
    },
    bigint: {
      label: "BigInt",
      gender: "m"
    },
    date: {
      label: "\u05EA\u05D0\u05E8\u05D9\u05DA",
      gender: "m"
    },
    array: {
      label: "\u05DE\u05E2\u05E8\u05DA",
      gender: "m"
    },
    object: {
      label: "\u05D0\u05D5\u05D1\u05D9\u05D9\u05E7\u05D8",
      gender: "m"
    },
    null: {
      label: "\u05E2\u05E8\u05DA \u05E8\u05D9\u05E7 (null)",
      gender: "m"
    },
    undefined: {
      label: "\u05E2\u05E8\u05DA \u05DC\u05D0 \u05DE\u05D5\u05D2\u05D3\u05E8 (undefined)",
      gender: "m"
    },
    symbol: {
      label: "\u05E1\u05D9\u05DE\u05D1\u05D5\u05DC (Symbol)",
      gender: "m"
    },
    function: {
      label: "\u05E4\u05D5\u05E0\u05E7\u05E6\u05D9\u05D4",
      gender: "f"
    },
    map: {
      label: "\u05DE\u05E4\u05D4 (Map)",
      gender: "f"
    },
    set: {
      label: "\u05E7\u05D1\u05D5\u05E6\u05D4 (Set)",
      gender: "f"
    },
    file: {
      label: "\u05E7\u05D5\u05D1\u05E5",
      gender: "m"
    },
    promise: {
      label: "Promise",
      gender: "m"
    },
    NaN: {
      label: "NaN",
      gender: "m"
    },
    unknown: {
      label: "\u05E2\u05E8\u05DA \u05DC\u05D0 \u05D9\u05D3\u05D5\u05E2",
      gender: "m"
    },
    value: {
      label: "\u05E2\u05E8\u05DA",
      gender: "m"
    }
  };
  const Sizable = {
    string: {
      unit: "\u05EA\u05D5\u05D5\u05D9\u05DD",
      shortLabel: "\u05E7\u05E6\u05E8",
      longLabel: "\u05D0\u05E8\u05D5\u05DA"
    },
    file: {
      unit: "\u05D1\u05D9\u05D9\u05D8\u05D9\u05DD",
      shortLabel: "\u05E7\u05D8\u05DF",
      longLabel: "\u05D2\u05D3\u05D5\u05DC"
    },
    array: {
      unit: "\u05E4\u05E8\u05D9\u05D8\u05D9\u05DD",
      shortLabel: "\u05E7\u05D8\u05DF",
      longLabel: "\u05D2\u05D3\u05D5\u05DC"
    },
    set: {
      unit: "\u05E4\u05E8\u05D9\u05D8\u05D9\u05DD",
      shortLabel: "\u05E7\u05D8\u05DF",
      longLabel: "\u05D2\u05D3\u05D5\u05DC"
    },
    number: {
      unit: "",
      shortLabel: "\u05E7\u05D8\u05DF",
      longLabel: "\u05D2\u05D3\u05D5\u05DC"
    }
    // no unit
  };
  const typeEntry = t => t ? TypeNames[t] : void 0;
  const typeLabel = t => {
    const e = typeEntry(t);
    if (e) return e.label;
    return t ?? TypeNames.unknown.label;
  };
  const withDefinite = t => `\u05D4${typeLabel(t)}`;
  const verbFor = t => {
    const e = typeEntry(t);
    const gender = e?.gender ?? "m";
    return gender === "f" ? "\u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05D9\u05D5\u05EA" : "\u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA";
  };
  const getSizing = origin => {
    if (!origin) return null;
    return Sizable[origin] ?? null;
  };
  const FormatDictionary = {
    regex: {
      label: "\u05E7\u05DC\u05D8",
      gender: "m"
    },
    email: {
      label: "\u05DB\u05EA\u05D5\u05D1\u05EA \u05D0\u05D9\u05DE\u05D9\u05D9\u05DC",
      gender: "f"
    },
    url: {
      label: "\u05DB\u05EA\u05D5\u05D1\u05EA \u05E8\u05E9\u05EA",
      gender: "f"
    },
    emoji: {
      label: "\u05D0\u05D9\u05DE\u05D5\u05D2'\u05D9",
      gender: "m"
    },
    uuid: {
      label: "UUID",
      gender: "m"
    },
    nanoid: {
      label: "nanoid",
      gender: "m"
    },
    guid: {
      label: "GUID",
      gender: "m"
    },
    cuid: {
      label: "cuid",
      gender: "m"
    },
    cuid2: {
      label: "cuid2",
      gender: "m"
    },
    ulid: {
      label: "ULID",
      gender: "m"
    },
    xid: {
      label: "XID",
      gender: "m"
    },
    ksuid: {
      label: "KSUID",
      gender: "m"
    },
    datetime: {
      label: "\u05EA\u05D0\u05E8\u05D9\u05DA \u05D5\u05D6\u05DE\u05DF ISO",
      gender: "m"
    },
    date: {
      label: "\u05EA\u05D0\u05E8\u05D9\u05DA ISO",
      gender: "m"
    },
    time: {
      label: "\u05D6\u05DE\u05DF ISO",
      gender: "m"
    },
    duration: {
      label: "\u05DE\u05E9\u05DA \u05D6\u05DE\u05DF ISO",
      gender: "m"
    },
    ipv4: {
      label: "\u05DB\u05EA\u05D5\u05D1\u05EA IPv4",
      gender: "f"
    },
    ipv6: {
      label: "\u05DB\u05EA\u05D5\u05D1\u05EA IPv6",
      gender: "f"
    },
    cidrv4: {
      label: "\u05D8\u05D5\u05D5\u05D7 IPv4",
      gender: "m"
    },
    cidrv6: {
      label: "\u05D8\u05D5\u05D5\u05D7 IPv6",
      gender: "m"
    },
    base64: {
      label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D1\u05D1\u05E1\u05D9\u05E1 64",
      gender: "f"
    },
    base64url: {
      label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D1\u05D1\u05E1\u05D9\u05E1 64 \u05DC\u05DB\u05EA\u05D5\u05D1\u05D5\u05EA \u05E8\u05E9\u05EA",
      gender: "f"
    },
    json_string: {
      label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA JSON",
      gender: "f"
    },
    e164: {
      label: "\u05DE\u05E1\u05E4\u05E8 E.164",
      gender: "m"
    },
    jwt: {
      label: "JWT",
      gender: "m"
    },
    ends_with: {
      label: "\u05E7\u05DC\u05D8",
      gender: "m"
    },
    includes: {
      label: "\u05E7\u05DC\u05D8",
      gender: "m"
    },
    lowercase: {
      label: "\u05E7\u05DC\u05D8",
      gender: "m"
    },
    starts_with: {
      label: "\u05E7\u05DC\u05D8",
      gender: "m"
    },
    uppercase: {
      label: "\u05E7\u05DC\u05D8",
      gender: "m"
    }
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return issue2 => {
    switch (issue2.code) {
      case "invalid_type":
        {
          const expectedKey = issue2.expected;
          const expected = TypeDictionary[expectedKey ?? ""] ?? typeLabel(expectedKey);
          const receivedType = parsedType(issue2.input);
          const received = TypeDictionary[receivedType] ?? TypeNames[receivedType]?.label ?? receivedType;
          if (/^[A-Z]/.test(issue2.expected)) {
            return `\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA instanceof ${issue2.expected}, \u05D4\u05EA\u05E7\u05D1\u05DC ${received}`;
          }
          return `\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${expected}, \u05D4\u05EA\u05E7\u05D1\u05DC ${received}`;
        }
      case "invalid_value":
        {
          if (issue2.values.length === 1) {
            return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05E2\u05E8\u05DA \u05D7\u05D9\u05D9\u05D1 \u05DC\u05D4\u05D9\u05D5\u05EA ${stringifyPrimitive(issue2.values[0])}`;
          }
          const stringified = issue2.values.map(v => stringifyPrimitive(v));
          if (issue2.values.length === 2) {
            return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05D4\u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA \u05D4\u05DF ${stringified[0]} \u05D0\u05D5 ${stringified[1]}`;
          }
          const lastValue = stringified[stringified.length - 1];
          const restValues = stringified.slice(0, -1).join(", ");
          return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05D4\u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA \u05D4\u05DF ${restValues} \u05D0\u05D5 ${lastValue}`;
        }
      case "too_big":
        {
          const sizing = getSizing(issue2.origin);
          const subject = withDefinite(issue2.origin ?? "value");
          if (issue2.origin === "string") {
            return `${sizing?.longLabel ?? "\u05D0\u05E8\u05D5\u05DA"} \u05DE\u05D3\u05D9: ${subject} \u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05DB\u05D9\u05DC ${issue2.maximum.toString()} ${sizing?.unit ?? ""} ${issue2.inclusive ? "\u05D0\u05D5 \u05E4\u05D7\u05D5\u05EA" : "\u05DC\u05DB\u05DC \u05D4\u05D9\u05D5\u05EA\u05E8"}`.trim();
          }
          if (issue2.origin === "number") {
            const comparison = issue2.inclusive ? `\u05E7\u05D8\u05DF \u05D0\u05D5 \u05E9\u05D5\u05D5\u05D4 \u05DC-${issue2.maximum}` : `\u05E7\u05D8\u05DF \u05DE-${issue2.maximum}`;
            return `\u05D2\u05D3\u05D5\u05DC \u05DE\u05D3\u05D9: ${subject} \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${comparison}`;
          }
          if (issue2.origin === "array" || issue2.origin === "set") {
            const verb = issue2.origin === "set" ? "\u05E6\u05E8\u05D9\u05DB\u05D4" : "\u05E6\u05E8\u05D9\u05DA";
            const comparison = issue2.inclusive ? `${issue2.maximum} ${sizing?.unit ?? ""} \u05D0\u05D5 \u05E4\u05D7\u05D5\u05EA` : `\u05E4\u05D7\u05D5\u05EA \u05DE-${issue2.maximum} ${sizing?.unit ?? ""}`;
            return `\u05D2\u05D3\u05D5\u05DC \u05DE\u05D3\u05D9: ${subject} ${verb} \u05DC\u05D4\u05DB\u05D9\u05DC ${comparison}`.trim();
          }
          const adj = issue2.inclusive ? "<=" : "<";
          const be = verbFor(issue2.origin ?? "value");
          if (sizing?.unit) {
            return `${sizing.longLabel} \u05DE\u05D3\u05D9: ${subject} ${be} ${adj}${issue2.maximum.toString()} ${sizing.unit}`;
          }
          return `${sizing?.longLabel ?? "\u05D2\u05D3\u05D5\u05DC"} \u05DE\u05D3\u05D9: ${subject} ${be} ${adj}${issue2.maximum.toString()}`;
        }
      case "too_small":
        {
          const sizing = getSizing(issue2.origin);
          const subject = withDefinite(issue2.origin ?? "value");
          if (issue2.origin === "string") {
            return `${sizing?.shortLabel ?? "\u05E7\u05E6\u05E8"} \u05DE\u05D3\u05D9: ${subject} \u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05DB\u05D9\u05DC ${issue2.minimum.toString()} ${sizing?.unit ?? ""} ${issue2.inclusive ? "\u05D0\u05D5 \u05D9\u05D5\u05EA\u05E8" : "\u05DC\u05E4\u05D7\u05D5\u05EA"}`.trim();
          }
          if (issue2.origin === "number") {
            const comparison = issue2.inclusive ? `\u05D2\u05D3\u05D5\u05DC \u05D0\u05D5 \u05E9\u05D5\u05D5\u05D4 \u05DC-${issue2.minimum}` : `\u05D2\u05D3\u05D5\u05DC \u05DE-${issue2.minimum}`;
            return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${subject} \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ${comparison}`;
          }
          if (issue2.origin === "array" || issue2.origin === "set") {
            const verb = issue2.origin === "set" ? "\u05E6\u05E8\u05D9\u05DB\u05D4" : "\u05E6\u05E8\u05D9\u05DA";
            if (issue2.minimum === 1 && issue2.inclusive) {
              const singularPhrase = issue2.origin === "set" ? "\u05DC\u05E4\u05D7\u05D5\u05EA \u05E4\u05E8\u05D9\u05D8 \u05D0\u05D7\u05D3" : "\u05DC\u05E4\u05D7\u05D5\u05EA \u05E4\u05E8\u05D9\u05D8 \u05D0\u05D7\u05D3";
              return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${subject} ${verb} \u05DC\u05D4\u05DB\u05D9\u05DC ${singularPhrase}`;
            }
            const comparison = issue2.inclusive ? `${issue2.minimum} ${sizing?.unit ?? ""} \u05D0\u05D5 \u05D9\u05D5\u05EA\u05E8` : `\u05D9\u05D5\u05EA\u05E8 \u05DE-${issue2.minimum} ${sizing?.unit ?? ""}`;
            return `\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: ${subject} ${verb} \u05DC\u05D4\u05DB\u05D9\u05DC ${comparison}`.trim();
          }
          const adj = issue2.inclusive ? ">=" : ">";
          const be = verbFor(issue2.origin ?? "value");
          if (sizing?.unit) {
            return `${sizing.shortLabel} \u05DE\u05D3\u05D9: ${subject} ${be} ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
          }
          return `${sizing?.shortLabel ?? "\u05E7\u05D8\u05DF"} \u05DE\u05D3\u05D9: ${subject} ${be} ${adj}${issue2.minimum.toString()}`;
        }
      case "invalid_format":
        {
          const _issue = issue2;
          if (_issue.format === "starts_with") return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05EA\u05D7\u05D9\u05DC \u05D1 "${_issue.prefix}"`;
          if (_issue.format === "ends_with") return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05E1\u05EA\u05D9\u05D9\u05DD \u05D1 "${_issue.suffix}"`;
          if (_issue.format === "includes") return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05DB\u05DC\u05D5\u05DC "${_issue.includes}"`;
          if (_issue.format === "regex") return `\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05EA\u05D0\u05D9\u05DD \u05DC\u05EA\u05D1\u05E0\u05D9\u05EA ${_issue.pattern}`;
          const nounEntry = FormatDictionary[_issue.format];
          const noun = nounEntry?.label ?? _issue.format;
          const gender = nounEntry?.gender ?? "m";
          const adjective = gender === "f" ? "\u05EA\u05E7\u05D9\u05E0\u05D4" : "\u05EA\u05E7\u05D9\u05DF";
          return `${noun} \u05DC\u05D0 ${adjective}`;
        }
      case "not_multiple_of":
        return `\u05DE\u05E1\u05E4\u05E8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D7\u05D9\u05D9\u05D1 \u05DC\u05D4\u05D9\u05D5\u05EA \u05DE\u05DB\u05E4\u05DC\u05D4 \u05E9\u05DC ${issue2.divisor}`;
      case "unrecognized_keys":
        return `\u05DE\u05E4\u05EA\u05D7${issue2.keys.length > 1 ? "\u05D5\u05EA" : ""} \u05DC\u05D0 \u05DE\u05D6\u05D5\u05D4${issue2.keys.length > 1 ? "\u05D9\u05DD" : "\u05D4"}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        {
          return `\u05E9\u05D3\u05D4 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF \u05D1\u05D0\u05D5\u05D1\u05D9\u05D9\u05E7\u05D8`;
        }
      case "invalid_union":
        return "\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF";
      case "invalid_element":
        {
          const place = withDefinite(issue2.origin ?? "array");
          return `\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF \u05D1${place}`;
        }
      default:
        return `\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF`;
    }
  };
};
function he_default() {
  return {
    localeError: error17()
  };
}

// node_modules/zod/v4/locales/hr.js
export { error17, he_default };

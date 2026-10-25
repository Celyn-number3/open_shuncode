// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
import { mark } from "../common/performance.js";
import "../common/performance.js";
import { join as join4 } from "../common/path.js";
import "../common/path.js";
import { Promises as Promises2 } from "./pfs.js";
import "./pfs.js";
import { syncBuiltInLanguagePacks } from "./shunCodeLanguagePackBootstrap.js";
// src/vs/base/node/nls.ts

import { promises as promises3 } from "fs";

// src/vs/base/node/shunCodeLanguagePackBootstrap.ts

// src/vs/base/node/nls.ts
async function resolveNLSConfiguration({
  userLocale: userLocale2,
  osLocale: osLocale2,
  userDataPath: userDataPath2,
  commit,
  nlsMetadataPath
}) {
  mark("code/willGenerateNls");
  if (process.env["VSCODE_DEV"] || userLocale2 === "pseudo" || userLocale2.startsWith("en") || !commit || !userDataPath2) {
    return defaultNLSConfiguration(userLocale2, osLocale2, nlsMetadataPath);
  }
  try {
    await syncBuiltInLanguagePacks(userDataPath2, nlsMetadataPath);
  } catch (error) {
    console.error("Bundled language pack sync failed.", error);
  }
  try {
    const languagePacks = await getLanguagePackConfigurations(userDataPath2);
    if (!languagePacks) {
      return defaultNLSConfiguration(userLocale2, osLocale2, nlsMetadataPath);
    }
    const resolvedLanguage = resolveLanguagePackLanguage(languagePacks, userLocale2);
    if (!resolvedLanguage) {
      return defaultNLSConfiguration(userLocale2, osLocale2, nlsMetadataPath);
    }
    const languagePack = languagePacks[resolvedLanguage];
    const mainLanguagePackPath = languagePack?.translations?.["vscode"];
    if (!languagePack || typeof languagePack.hash !== "string" || !languagePack.translations || typeof mainLanguagePackPath !== "string" || !(await Promises2.exists(mainLanguagePackPath))) {
      return defaultNLSConfiguration(userLocale2, osLocale2, nlsMetadataPath);
    }
    const languagePackId = `${languagePack.hash}.${resolvedLanguage}`;
    const globalLanguagePackCachePath = join4(userDataPath2, "clp", languagePackId);
    const commitLanguagePackCachePath = join4(globalLanguagePackCachePath, commit);
    const languagePackMessagesFile = join4(commitLanguagePackCachePath, "nls.messages.json");
    const translationsConfigFile2 = join4(globalLanguagePackCachePath, "tcf.json");
    const languagePackCorruptMarkerFile = join4(globalLanguagePackCachePath, "corrupted.info");
    if (await Promises2.exists(languagePackCorruptMarkerFile)) {
      await promises3.rm(globalLanguagePackCachePath, {
        recursive: true,
        force: true,
        maxRetries: 3
      });
    }
    const result = {
      userLocale: userLocale2,
      osLocale: osLocale2,
      resolvedLanguage,
      defaultMessagesFile: join4(nlsMetadataPath, "nls.messages.json"),
      languagePack: {
        translationsConfigFile: translationsConfigFile2,
        messagesFile: languagePackMessagesFile,
        corruptMarkerFile: languagePackCorruptMarkerFile
      },
      // NLS: below properties are a relic from old times only used by vscode-nls and deprecated
      locale: userLocale2,
      availableLanguages: {
        "*": resolvedLanguage
      },
      _languagePackId: languagePackId,
      _languagePackSupport: true,
      _translationsConfigFile: translationsConfigFile2,
      _cacheRoot: globalLanguagePackCachePath,
      _resolvedLanguagePackCoreLocation: commitLanguagePackCachePath,
      _corruptedFile: languagePackCorruptMarkerFile
    };
    if (await Promises2.exists(languagePackMessagesFile)) {
      touch(commitLanguagePackCachePath).catch(() => {});
      mark("code/didGenerateNls");
      return result;
    }
    const [nlsDefaultKeys, nlsDefaultMessages, nlsPackdata] = await Promise.all([promises3.readFile(join4(nlsMetadataPath, "nls.keys.json"), "utf-8").then(content => JSON.parse(content)), promises3.readFile(join4(nlsMetadataPath, "nls.messages.json"), "utf-8").then(content => JSON.parse(content)), promises3.readFile(mainLanguagePackPath, "utf-8").then(content => JSON.parse(content))]);
    const nlsResult = [];
    let nlsIndex = 0;
    for (const [moduleId, nlsKeys] of nlsDefaultKeys) {
      const moduleTranslations = nlsPackdata.contents[moduleId];
      for (const nlsKey of nlsKeys) {
        nlsResult.push(moduleTranslations?.[nlsKey] || nlsDefaultMessages[nlsIndex]);
        nlsIndex++;
      }
    }
    await promises3.mkdir(commitLanguagePackCachePath, {
      recursive: true
    });
    await Promise.all([promises3.writeFile(languagePackMessagesFile, JSON.stringify(nlsResult), "utf-8"), promises3.writeFile(translationsConfigFile2, JSON.stringify(languagePack.translations), "utf-8")]);
    mark("code/didGenerateNls");
    return result;
  } catch (error) {
    console.error("Generating translation files failed.", error);
  }
  return defaultNLSConfiguration(userLocale2, osLocale2, nlsMetadataPath);
}
async function getLanguagePackConfigurations(userDataPath2) {
  const configFile = join4(userDataPath2, "languagepacks.json");
  try {
    return JSON.parse(await promises3.readFile(configFile, "utf-8"));
  } catch (err) {
    return void 0;
  }
}
function resolveLanguagePackLanguage(languagePacks, locale) {
  try {
    while (locale) {
      if (languagePacks[locale]) {
        return locale;
      }
      const index = locale.lastIndexOf("-");
      if (index > 0) {
        locale = locale.substring(0, index);
      } else {
        return void 0;
      }
    }
  } catch (error) {
    console.error("Resolving language pack configuration failed.", error);
  }
  return void 0;
}
function defaultNLSConfiguration(userLocale2, osLocale2, nlsMetadataPath) {
  mark("code/didGenerateNls");
  return {
    userLocale: userLocale2,
    osLocale: osLocale2,
    resolvedLanguage: "en",
    defaultMessagesFile: join4(nlsMetadataPath, "nls.messages.json"),
    // NLS: below 2 are a relic from old times only used by vscode-nls and deprecated
    locale: userLocale2,
    availableLanguages: {}
  };
}
function touch(path4) {
  const date = /* @__PURE__ */new Date();
  return promises3.utimes(path4, date, date);
}

// src/main.ts
export { promises3, resolveNLSConfiguration, getLanguagePackConfigurations, resolveLanguagePackLanguage, defaultNLSConfiguration, touch, promises3 as promises };

// @ts-nocheck
// Evidence-based JS implementation in TS source syntax; original type information is not claimed.
// Statement provenance: SHUNCODE_RECONSTRUCTION.json.
// src/vs/base/node/shunCodeLanguagePackBootstrap.ts
import { createHash } from "node:crypto";
import { promises as fs4 } from "node:fs";
import * as path2 from "node:path";
var BUILT_IN_LANGUAGE_PACK_PREFIX = "vscode-language-pack-";
async function syncBuiltInLanguagePacks(userDataPath2, nlsMetadataPath) {
  const extensionsRoot = await findExtensionsRoot(nlsMetadataPath);
  if (!extensionsRoot) {
    return;
  }
  const synced = await readBuiltInLanguagePacks(extensionsRoot);
  const languages = Object.keys(synced);
  if (!languages.length) {
    return;
  }
  const configFile = path2.join(userDataPath2, "languagepacks.json");
  let current;
  try {
    current = JSON.parse(await fs4.readFile(configFile, "utf-8"));
  } catch {
    current = {};
  }
  let changed = false;
  for (const language2 of languages) {
    if (JSON.stringify(current[language2]) !== JSON.stringify(synced[language2])) {
      current[language2] = synced[language2];
      changed = true;
    }
  }
  if (!changed) {
    return;
  }
  await fs4.mkdir(path2.dirname(configFile), {
    recursive: true
  });
  await fs4.writeFile(configFile, JSON.stringify(current), "utf-8");
}
async function findExtensionsRoot(nlsMetadataPath) {
  for (const candidate of [path2.join(nlsMetadataPath, "..", "extensions"), path2.join(nlsMetadataPath, "extensions")]) {
    try {
      if ((await fs4.stat(candidate)).isDirectory()) {
        return candidate;
      }
    } catch {}
  }
  return void 0;
}
async function readBuiltInLanguagePacks(extensionsRoot) {
  const result = {};
  let directories;
  try {
    directories = (await fs4.readdir(extensionsRoot, {
      withFileTypes: true
    })).filter(entry => entry.isDirectory() && entry.name.startsWith(BUILT_IN_LANGUAGE_PACK_PREFIX)).map(entry => entry.name);
  } catch {
    return result;
  }
  for (const directory of directories) {
    const packRoot = path2.join(extensionsRoot, directory);
    let manifest;
    try {
      manifest = JSON.parse(await fs4.readFile(path2.join(packRoot, "package.json"), "utf-8"));
    } catch {
      continue;
    }
    if (typeof manifest.publisher !== "string" || typeof manifest.name !== "string" || typeof manifest.version !== "string") {
      continue;
    }
    const extensionId = `${manifest.publisher}.${manifest.name}`;
    for (const localization of manifest.contributes?.localizations ?? []) {
      if (!isValidLocalization(localization)) {
        continue;
      }
      const translations = {};
      for (const translation of localization.translations) {
        translations[translation.id] = path2.join(packRoot, translation.path);
      }
      if (typeof translations["vscode"] !== "string" || !(await fileExists(translations["vscode"]))) {
        continue;
      }
      const md5 = createHash("md5");
      md5.update(extensionId).update(manifest.version);
      result[localization.languageId] = {
        hash: md5.digest("hex"),
        extensions: [{
          extensionIdentifier: {
            id: extensionId
          },
          version: manifest.version
        }],
        translations,
        label: localization.localizedLanguageName ?? localization.languageName
      };
    }
  }
  return result;
}
function isValidLocalization(localization) {
  if (typeof localization.languageId !== "string" || !localization.languageId) {
    return false;
  }
  if (!Array.isArray(localization.translations) || localization.translations.length === 0) {
    return false;
  }
  return localization.translations.every(translation => typeof translation.id === "string" && !!translation.id && typeof translation.path === "string" && !!translation.path && !path2.isAbsolute(translation.path));
}
async function fileExists(filePath) {
  try {
    await fs4.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// src/vs/base/node/nls.ts
export { createHash, fs4, path2, BUILT_IN_LANGUAGE_PACK_PREFIX, syncBuiltInLanguagePacks, findExtensionsRoot, readBuiltInLanguagePacks, isValidLocalization, fileExists, fs4 as fs, path2 as path };

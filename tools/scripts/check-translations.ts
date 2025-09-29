/* eslint-disable no-console */
import fs from "fs";
import path from "path";

const translationsDir = path.join(
  __dirname,
  "../../../packages/translations/src/resources",
);
const sourceLang = "en"; // your main language
const sourceFile = path.join(translationsDir, sourceLang, "translations.json");

function flatten(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: Record<string, any>,
  prefix = "",
): Record<string, string> {
  return Object.keys(obj).reduce((acc: Record<string, string>, key) => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      Object.assign(acc, flatten(value, newKey));
    } else {
      acc[newKey] = String(value);
    }

    return acc;
  }, {});
}

// load source language
const source = JSON.parse(fs.readFileSync(sourceFile, "utf8"));
const sourceKeys = Object.keys(flatten(source));

// find all language folders except the source
const langDirs = fs
  .readdirSync(translationsDir)
  .filter(
    (f) =>
      fs.statSync(path.join(translationsDir, f)).isDirectory() &&
      f !== sourceLang,
  );
let hasErrors = false;

for (const lang of langDirs) {
  const filePath = path.join(translationsDir, lang, "translations.json");
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing translations.json for language: ${lang}`);
    hasErrors = true;
    continue;
  }
  const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const targetKeys = Object.keys(flatten(content));

  const missing = sourceKeys.filter((k) => !targetKeys.includes(k));
  const extra = targetKeys.filter((k) => !sourceKeys.includes(k));

  if (missing.length > 0) {
    console.error(`❌ Missing keys in ${lang}/translations.json:`);
    missing.forEach((k) => console.log(` - ${k}`));
    hasErrors = true;
  } else {
    console.log(`✅ No missing keys in ${lang}/translations.json`);
  }

  if (extra.length > 0) {
    console.log(`⚠️ Extra keys in ${lang}/translations.json:`);
    extra.forEach((k) => console.log(` - ${k}`));
  }
}

if (hasErrors) {
  process.exit(1);
}

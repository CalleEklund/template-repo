import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";

const locales = path.join(__dirname, "../resources");
const languages = fs.readdirSync(locales);

interface FlatObject {
  [key: string]: string | FlatObject;
}

const getFlatKeys = (obj: FlatObject, prefix: string = ""): string[] =>
  Object.entries(obj).flatMap(([key, val]) =>
    typeof val === "object"
      ? getFlatKeys(val as FlatObject, `${prefix}${key}.`)
      : `${prefix}${key}`,
  );

describe("i18n resources check", () => {
  it("should have locales directory", () => {
    expect(fs.existsSync(locales)).toBe(true);
  });

  it("should have all languages", () => {
    const expectedLanguages = ["en", "sv"];
    expect(languages).toEqual(expect.arrayContaining(expectedLanguages));
  });
});

describe("i18n key consistency", () => {
  if (!languages[0]) {
    throw new Error("No languages found in locales directory");
  }
  const namespaces = fs.readdirSync(path.join(locales, languages[0]));

  namespaces.forEach((namespace) => {
    it(`should have matching keys in all languages for namespace "${namespace}"`, () => {
      const keysByLang: { [language: string]: Set<string> } = {};

      languages.forEach((language) => {
        const filePath = path.join(locales, language, namespace);
        const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
        keysByLang[language] = new Set(getFlatKeys(content));
      });

      const baseLang = languages[0];
      if (!baseLang || !(baseLang in keysByLang)) {
        throw new Error(
          "Base language is undefined or not found in keysByLang",
        );
      }
      const baseKeys = keysByLang[baseLang] ?? new Set<string>();

      for (const lang of languages) {
        const missingInLang = [...baseKeys].filter(
          (k) => !(keysByLang[lang] ?? new Set()).has(k),
        );
        const extraInLang = [...(keysByLang[lang] ?? new Set())].filter(
          (k) => !baseKeys.has(k),
        );

        expect(missingInLang).toEqual([]);
        expect(extraInLang).toEqual([]);
      }
    });
  });
});

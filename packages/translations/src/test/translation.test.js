import { expect } from "@jest/globals";
import { describe, it } from "@jest/globals";
import fs from "fs";
import path from "path";

const locales = path.join(__dirname, "../src/resources");
const languages = fs.readdirSync(locales);

const getFlatKeys = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([key, val]) =>
    typeof val === "object"
      ? getFlatKeys(val, `${prefix}${key}.`)
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
  const namespaces = fs.readdirSync(path.join(locales, languages[0]));

  namespaces.forEach((namespace) => {
    it(`should have matching keys in all languages for namespace "${namespace}"`, () => {
      const keysByLang = {};

      languages.forEach((language) => {
        const filePath = path.join(locales, language, namespace);
        const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
        keysByLang[language] = new Set(getFlatKeys(content));
      });

      const baseLang = languages[0];
      const baseKeys = keysByLang[baseLang];

      for (const lang of languages) {
        //find missing keys
        const missingInLang = [...baseKeys].filter(
          (k) => !keysByLang[lang].has(k),
        );
        //find exessive keys
        const extraInLang = [...keysByLang[lang]].filter(
          (k) => !baseKeys.has(k),
        );

        expect(missingInLang).toEqual([]);
        expect(extraInLang).toEqual([]);
      }
    });
  });
});

import { resources } from "@template-repo/translations";
import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    // This makes i18next infer keys/types from your resources object
    resources: (typeof resources)[keyof typeof resources];
    defaultNS: "common"; // same as in your init config
  }
}

import z from "zod";

export const DatePreprocessor = z.preprocess((value) => {
  if (typeof value === "number") {
    return new Date(value);
  }
  if (typeof value === "string") {
    return new Date(value);
  }
  return value;
}, z.date());

module.exports = {
  preset: "ts-jest",
  passWithNoTests: true,
  verbose: true,
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/src/$1",
  },
  testTimeout: 60000,
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
};

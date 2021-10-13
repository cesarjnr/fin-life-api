module.exports = {
  preset: "ts-jest",
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/main.ts",
    "!src/**/*.module.ts"
  ]
};

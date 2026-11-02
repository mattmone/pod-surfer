import { playwrightLauncher } from "@web/test-runner-playwright";

export default {
  files: "src/__tests__/**/*.test.js",
  nodeResolve: true,
  browsers: [
    playwrightLauncher({ product: "chromium" }),
  ],
  testFramework: {
    config: {
      timeout: "5000",
    },
  },
};

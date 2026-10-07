module.exports = {
  swSrc: "./dist/service-worker.js",
  swDest: "./service-worker.js",
  globDirectory: "./",
  globPatterns: ["**/*.js", "**/*.html", "**/*.png", "**/*.json"],
  globIgnores: ["**/node_modules/**/*", "dist/service-worker.js", "service-worker.js"],
};

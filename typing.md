# Typing Roadmap for **pod‑surfer**

This document outlines a step‑by‑step plan to add full type safety to the existing JavaScript codebase using **TypeScript declaration (`.d.ts`) files** and **JSDoc** annotations.

---

## 📋 Overview

| Phase                          | Goal                                                          | Key Tasks                                                                                                                                                                                                                                                              | Artefacts                                                        |
| ------------------------------ | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **1️⃣ Prepare the environment** | Enable TypeScript tooling without breaking the current build. | • Add `tsconfig.json` with `allowJs` / `checkJs`.<br>• Install dev deps: `typescript`, `@types/node`, `eslint`, `eslint-plugin-jsdoc`, `prettier`, `eslint-config-prettier`.<br>• Add npm script `npm run lint:ts`.<br>• Configure editor to treat JS as type‑checked. | `tsconfig.json`, updated `package.json` scripts, `.eslintrc.cjs` |
| **2️⃣ Baseline type checking**  | Surface existing type problems.                               | • Run `npx tsc --noEmit` (or `npm run lint:ts`).<br>• Capture errors in a **TODO list** (e.g., “Missing type for `fetchPod`”).                                                                                                                                         | `type‑issues.md`                                                 |
| **3️⃣ JSDoc‑first migration** | Add type info directly in source files. | • Start with high‑impact modules (e.g., `src/index.js`).<br>• Add JSDoc blocks with `@param`, `@returns`, `@typedef`.<br>• Use `/** @type {import("./utils").PodInfo} */` for imported objects.<br>• Re‑run TypeScript after each file to verify errors drop. | Updated `.js` files with JSDoc (e.g., `src/index.js`) |
| **4️⃣ Generate / write `.d.ts` files** | Provide a separate type surface for consumers. | • Create `types/` mirroring source (`types/src/...`).<br>• Copy JSDoc‑derived signatures into `.d.ts` files (e.g., `types/src/utils.d.ts`).<br>• Export a top‑level `index.d.ts` that re‑exports everything. | `types/` directory with `.d.ts` files |
| **5️⃣ Enforce strict mode** | Increase type safety once low‑hanging fruit is resolved. | • In `tsconfig.json`, enable `strict`, `noImplicitAny`, `strictNullChecks`, `noImplicitThis`, `alwaysStrict`.
• Re‑run compiler, resolve new errors (often just improving JSDoc or adding explicit types). | Updated `tsconfig.json` |
| **6️⃣ CI / Automation** | Keep future changes typed. | • Add CI step `npm run lint:ts` (or `npx tsc --noEmit`).
• Optionally add `npm run lint:jsdoc`.
| `.github/workflows/typing.yml`, `husky` config |
| **7️⃣ Documentation & Knowledge Transfer** | Align the team on the new workflow. | • Write **Type‑Guide.md** covering:
– How to add JSDoc
– When to create a `.d.ts`
– Linting commands
– Common pitfalls
• Add a link in `README.md`. | `Type-Guide.md` |

---

## 🗓️ Rough Timeline (single developer)

| Week | Deliverable                                                       |
| ---- | ----------------------------------------------------------------- |
| 1    | Add tooling, `tsconfig.json`, capture baseline errors.            |
| 2‑3  | JSDoc migration for core modules (`src/index.js`, service files). |
| 4    | Create `types/` folder with initial `.d.ts` files.                |
| 5    | Enable `strict` flags, fix remaining errors.                      |
| 6    | CI pipeline, pre‑commit hook, write `Type-Guide.md`.              |

---

## 🛠️ Recommended Tooling

- **TypeScript (`tsc`)** – core type‑checker, can emit declaration files.
- **ESLint + `eslint-plugin-jsdoc`** – enforces consistent JSDoc style.
- **Prettier** – auto‑formats code and JSDoc blocks.
- **GitHub Actions** – CI enforcement across all PRs.

---

## ✅ Next Steps

1. **Approve** this roadmap or specify phases to prioritize.
2. Share any **constraints** (e.g., CI must stay green, limited PR bandwidth, preferred TypeScript version).
3. If you’d like a **starter PR**, I can generate the initial `tsconfig.json`, ESLint config, and a sample JSDoc block for `src/index.js`.

Feel free to request adjustments or ask for deeper details on any phase.

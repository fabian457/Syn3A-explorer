#!/usr/bin/env node
/**
 * Loads data/products.js as real JavaScript (via Node's vm module) rather
 * than approximating its structure with regex, and prints PRODUCTS +
 * GENOME_LENGTH_BP as JSON on stdout for other tools to consume.
 *
 * products.js is a plain script (not a module, no `module.exports`), so it's
 * evaluated in a sandbox context and its top-level consts are read back off
 * that sandbox afterward.
 *
 * Usage: node tools/parse-products.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const productsPath = path.join(__dirname, "..", "data", "products.js");
const code = fs.readFileSync(productsPath, "utf8");

// `const`/`let` at the top level of a vm-run script do NOT become properties
// of the sandbox/context object (only `var` does) -- so we append a
// statement to the *same* script, in the same scope, to copy them onto
// globalThis explicitly before we read anything back from outside.
const codeWithExport = `${code}\nglobalThis.__PARSED__ = { genomeLengthBp: GENOME_LENGTH_BP, products: PRODUCTS };\n`;

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(codeWithExport, sandbox, { filename: "products.js" });

process.stdout.write(JSON.stringify(sandbox.__PARSED__));

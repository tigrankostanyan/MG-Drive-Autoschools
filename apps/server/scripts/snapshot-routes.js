// Throwaway: list all registered routes with method, path, and middleware names
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", ".env"), override: true });
process.env.NODE_ENV = "test";

const express = require("express");
const Api = require("../src/utils/api");
const routes = require("../src/routes");

const app = express();
Api(app);

function middlewareNames(layer) {
  const names = [];
  // Express Router / middleware layers
  if (layer.name && layer.name !== "<anonymous>" && layer.name !== "router") {
    names.push(layer.name);
  }
  if (layer.handle && layer.handle.name && layer.handle.name !== "<anonymous>") {
    names.push(layer.handle.name);
  }
  return [...new Set(names)];
}

function printStack(stack, prefix) {
  for (const layer of stack) {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).map((m) => m.toUpperCase());
      const fullPath = prefix + (layer.route.path || "");
      console.log(`${methods.join(", ")} ${fullPath} [${middlewareNames(layer).join(", ")}]`);
    } else if (layer.name === "router" && layer.handle && layer.handle.stack) {
      const routerPath = prefix + (layer.regexp?.toString().match(/^\^\\\/(.+?)\\\/.*$/)?.[1] || "");
      printStack(layer.handle.stack, "/" + routerPath.replace(/\/$/, ""));
    }
  }
}

// Walk the app-level stack
for (const layer of app._router.stack) {
  if (layer.name === "router" && layer.handle && layer.handle.stack) {
    const base = layer.regexp?.toString().match(/^\^\\\/(.+?)\\\/.*$/)?.[1] || "";
    const prefix = base ? "/" + base : "";
    printStack(layer.handle.stack, prefix);
  }
}

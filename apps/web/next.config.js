import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root so Next doesn't pick up unrelated lockfiles above the monorepo.
  turbopack: {
    root: path.join(dirname, "..", ".."),
  },
};

export default nextConfig;

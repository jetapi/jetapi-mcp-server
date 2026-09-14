// Builds build/jetapi-mcp-server.mcpb (Claude Desktop extension):
// compiled server + production node_modules + manifest.json + icon.
// Run `npm run build` first.
import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("..", import.meta.url))
const buildDir = join(root, "build")
const stage = join(buildDir, "mcpb")
const output = join(buildDir, "jetapi-mcp-server.mcpb")

const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))
const manifest = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"))
if (manifest.version !== pkg.version) {
  throw new Error(`manifest.json version ${manifest.version} does not match package.json ${pkg.version}`)
}
if (!existsSync(join(root, "dist", "index.js"))) {
  throw new Error("dist/index.js not found — run `npm run build` first")
}

rmSync(buildDir, { recursive: true, force: true })
mkdirSync(stage, { recursive: true })
for (const entry of ["dist", "manifest.json", "icon.png", "package.json", "package-lock.json", "README.md", "LICENSE"]) {
  cpSync(join(root, entry), join(stage, entry), { recursive: true })
}

execFileSync("npm", ["ci", "--omit=dev", "--ignore-scripts", "--no-audit", "--no-fund"], { cwd: stage, stdio: "inherit" })
execFileSync("npx", ["--no-install", "mcpb", "validate", join(stage, "manifest.json")], { cwd: root, stdio: "inherit" })
execFileSync("npx", ["--no-install", "mcpb", "pack", stage, output], { cwd: root, stdio: "inherit" })

const sha256 = createHash("sha256").update(readFileSync(output)).digest("hex")
process.stdout.write(`\nBuilt ${output}\nsha256 ${sha256}\n`)

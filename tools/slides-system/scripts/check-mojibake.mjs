import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const defaultTargets = ["README.md", "src", "tests"];
const suspiciousPatterns = ["Ã", "Â", "â€", "â€”", "â€“", "â€œ", "â€", "â€™"];
const allowedExtensions = new Set([".ts", ".tsx", ".js", ".mjs", ".cjs", ".md", ".json", ".yaml", ".yml"]);
const ignoredDirs = new Set(["node_modules", "dist", "vendor", ".git"]);

function collectFiles(targetPath, bucket) {
  if (!fs.existsSync(targetPath)) return;

  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(targetPath, { withFileTypes: true })) {
      if (entry.isDirectory() && ignoredDirs.has(entry.name)) continue;
      collectFiles(path.join(targetPath, entry.name), bucket);
    }
    return;
  }

  if (allowedExtensions.has(path.extname(targetPath))) {
    bucket.push(targetPath);
  }
}

function findIssues(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const issues = [];
  for (const pattern of suspiciousPatterns) {
    if (content.includes(pattern)) {
      issues.push(pattern);
    }
  }
  return issues;
}

const rawTargets = process.argv.slice(2);
const targets = rawTargets.length > 0 ? rawTargets : defaultTargets;
const files = [];

for (const target of targets) {
  collectFiles(path.resolve(root, target), files);
}

const failures = [];
for (const filePath of files) {
  const issues = findIssues(filePath);
  if (issues.length > 0) {
    failures.push({
      filePath: path.relative(root, filePath),
      issues,
    });
  }
}

if (failures.length > 0) {
  console.error("Se detectó posible mojibake en estos archivos:");
  for (const failure of failures) {
    console.error(`- ${failure.filePath}: ${failure.issues.join(", ")}`);
  }
  process.exit(1);
}

console.log(`check-mojibake: OK (${files.length} archivos revisados)`);

// tools/ensureQaArtifacts.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dirs = [
  "qa-artifacts",
  "qa-artifacts/screens",
  "qa-artifacts/videos",
  "qa-artifacts/seeds",
  "qa-artifacts/report",
  "qa-artifacts/.output",
  "e2e"
];

console.log("[ensureQaArtifacts] Criando diretórios de QA...");

for (const d of dirs) {
  try {
    mkdirSync(d, { recursive: true });
    console.log(`[ensureQaArtifacts] ✅ Criado: ${d}`);
    
    // adiciona .gitkeep para versionar diretórios vazios
    const keep = join(d, ".gitkeep");
    try { 
      writeFileSync(keep, "# Diretório de artefatos de QA\n"); 
      console.log(`[ensureQaArtifacts] ✅ .gitkeep criado: ${keep}`);
    } catch (err) {
      // Ignorar se já existe
    }
  } catch (err) {
    console.error(`[ensureQaArtifacts] ❌ Erro ao criar ${d}:`, err.message);
  }
}

console.log("[ensureQaArtifacts] ✅ Concluído! Diretórios criados:", dirs.join(", "));

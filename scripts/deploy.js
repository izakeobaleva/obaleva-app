const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Cria um arquivo de versão que muda a cada deploy
const versionFile = path.join(__dirname, '..', 'src', 'version.ts')
const version = {
  timestamp: Date.now(),
  version: `1.0.${Math.floor(Date.now() / 1000)}`
}

fs.writeFileSync(versionFile, `
// Este arquivo é gerado automaticamente para forçar novo build
export const APP_VERSION = '${version.version}'
export const BUILD_TIME = ${version.timestamp}
`)

console.log(`✅ Versão ${version.version} gerada para build`)

// Executa o build
execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, '..') })
const { readFile, writeFile } = require('fs/promises')

async function loadJsonFile(fileName) {
  return JSON.parse(await readFile(fileName, 'utf-8'))
}

function saveJsonFile(fileName, content) {
  return writeFile(fileName, JSON.stringify(content, null, 2))
}

async function patchManifestVersion() {
  const [{ version }, manifest] = await Promise.all([
    loadJsonFile('package.json'),
    loadJsonFile('manifest.json'),
  ])

  manifest.version = version

  await saveJsonFile('manifest.json', manifest)
}

patchManifestVersion()

var blossom = new window.blossom.Blossom()

function setText(id, text) {
  const element = document.getElementById(id)
  element.innerText = text
  element.setAttribute('complete', 'true')
}

function setSuccess(id) {
  setText(id, 'success')
}

async function createPod() {
  try {
    await blossom.fdpStorage.personalStorage.create(blossom.dappId)
    setSuccess('create-pod')
  } catch (error) {
    setText('create-pod', error)
  }
}

async function checkIfPodCreated() {
  const created = await blossom.fdpStorage.personalStorage.isDappPodCreated()

  setText('pod-created', created)
}

async function createDirectory() {
  await blossom.fdpStorage.directory.create(blossom.dappId, '/blossom')

  setSuccess('create-directory')
}

async function uploadFile() {
  await blossom.fdpStorage.file.uploadData(blossom.dappId, '/blossom/test.txt', 'Blossom')

  setSuccess('upload-file')
}

async function downloadFile() {
  // TODO Check why content is number array
  const content = await blossom.fdpStorage.file.downloadData(blossom.dappId, '/blossom/test.txt')

  setSuccess('download-file')
}

async function createRandomPod(id) {
  try {
    await blossom.fdpStorage.personalStorage.create(`random-pod-${String(Math.random()).substring(2)}`)

    setSuccess(id)
  } catch (error) {
    setText(id, 'failed')
  }
}

function createRandomPod1() {
  createRandomPod('random-pod-create')
}

function createRandomPod2() {
  createRandomPod('random-pod-create-2')
}

async function requestFullAccess() {
  const allowed = await blossom.fdpStorage.personalStorage.requestFullAccess()

  setText('full-access', allowed)
}

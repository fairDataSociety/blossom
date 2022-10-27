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
    await blossom.fdpStorage.personalStorage.create('test-pod')
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

var blossom = new window.blossom.Blossom(getBlossomId())

async function createPod() {
  await blossom.fdpStorage.personalStorage.create('test-pod')

  setTextToElement('create-pod', 'success')
}

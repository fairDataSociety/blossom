var blossom = new window.blossom.Blossom(window.blossom.localNetwork, getBlossomId())

async function echo() {
  const response = await blossom.echo('Echo message')

  setTextToElement('echo', response)
}

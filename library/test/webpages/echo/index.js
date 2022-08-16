var blossom = new window.blossom.Blossom(getBlossomId())

async function echo() {
  const response = await blossom.echo('Echo message')

  setTextToElement('echo', response)
}

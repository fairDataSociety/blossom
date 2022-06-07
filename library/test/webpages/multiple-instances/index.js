async function testFn() {
  const blossom1 = new window.blossom.Blossom(window.blossom.Networks.localhost, getBlossomId())
  const blossom2 = new window.blossom.Blossom(window.blossom.Networks.localhost, getBlossomId())
  const blossom3 = new window.blossom.Blossom(window.blossom.Networks.localhost, getBlossomId())

  const createResponseHandler = function (expectedResponse, elementId) {
    return function (response) {
      if (response === expectedResponse) {
        setTextToElement(elementId, 'Received')
      } else {
        setTextToElement(elementId, 'Wrong')
      }
    }
  }

  await Promise.all([
    blossom1.echo('1').then(createResponseHandler('1', 'response1-1')),
    blossom2.echo('2').then(createResponseHandler('2', 'response1-2')),
    blossom3.echo('3').then(createResponseHandler('3', 'response1-3')),
  ])

  blossom2.echo('2').then(createResponseHandler('2', 'response2-2'))

  const promise = Promise.all([
    blossom1.echo('1').then(createResponseHandler('1', 'response2-1')),
    blossom3.echo('3').then(createResponseHandler('3', 'response2-3')),
  ])

  blossom2.closeConnection()

  await promise
}

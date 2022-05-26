function setTextToElement(id, text) {
  document.getElementById(id).innerText = text
}

function getBlossomId() {
  const url = new URL(location.href)
  return url.searchParams.get('blossomId')
}

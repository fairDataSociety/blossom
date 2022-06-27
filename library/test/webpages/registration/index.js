var blossom = new window.blossom.Blossom(window.blossom.localNetwork, getBlossomId())
var username = 'test_user',
  password = 'pass123'

async function register() {
  await blossom.register(username, password)

  setTextToElement('registration', 'success')
}

async function login() {
  await blossom.login(username, password)

  setTextToElement('login', 'success')
}

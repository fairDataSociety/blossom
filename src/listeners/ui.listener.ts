import { disableMenu } from '../utils/menu'
import { openTab } from '../utils/tabs'

function initialize() {
  chrome.action.onClicked.addListener(onLogoClick)
}

function onLogoClick() {
  openTab('auth.html')
}

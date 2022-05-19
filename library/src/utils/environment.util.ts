export function isServiceWorkerEnv() {
  // TODO remove check for manifest v2 background scripts
  return typeof importScripts === 'function' || typeof chrome === 'object'
}

export function isWebPageEnv() {
  return typeof window === 'object'
}

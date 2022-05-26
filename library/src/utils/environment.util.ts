export function isServiceWorkerEnv() {
  // TODO remove check for manifest v2 background scripts
  return typeof importScripts === 'function'
}

export function isWebPageEnv() {
  return typeof window === 'object'
}

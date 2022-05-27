export function isServiceWorkerEnv() {
  return typeof importScripts === 'function'
}

export function isWebPageEnv() {
  return typeof window === 'object'
}

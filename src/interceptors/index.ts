import consoleInterceptor from './console.interceptor'

if (process.env.CI === 'true') {
  consoleInterceptor()
}

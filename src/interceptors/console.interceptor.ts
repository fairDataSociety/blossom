import { TEST_WEB_SERVER_URL } from '../../test/config/constants'

let counter = 1

const consoleInterceptor = () => {
  const consoleProxy = {
    get(target, propertyName) {
      const property = target[propertyName]

      if (property?.name !== 'error') {
        return property
      }

      return (...args) => {
        const result = property.apply(this, args)

        chrome.cookies.set({
          url: TEST_WEB_SERVER_URL,
          name: `console.error-${counter++}`,
          value: args.reduce(
            (value, arg, i) => value + (i > 0 && i <= args.length - 1 ? ', ' + arg : ''),
            '',
          ),
        })

        return result
      }
    },
  }

  global.console = new Proxy(global.console, consoleProxy)
}

export default consoleInterceptor

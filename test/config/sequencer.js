const Sequencer = require('@jest/test-sequencer').default

class TestSequencer extends Sequencer {
  sort(tests) {
    const dappsTestIndex = tests.findIndex((test) => test.path.includes('dapp-library.spec.ts'))
    const dappsTest = tests[dappsTestIndex]

    const copyTests = Array.from(tests)

    copyTests.splice(dappsTestIndex, 1)

    copyTests.push(dappsTest)

    return copyTests
  }
}

module.exports = TestSequencer

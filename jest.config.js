module.exports = {
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/test/**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  setupFiles: ['dotenv/config']
};

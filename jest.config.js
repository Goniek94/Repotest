module.exports = {
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  },
  transformIgnorePatterns: ['node_modules/(?!(axios)/)'],
  moduleNameMapper: {
    '^axios$': 'axios/dist/node/axios.cjs'
  },
  testEnvironment: 'jsdom'
};

module.exports = {
  testEnvironmentOptions: {
    NODE_ENV: 'test',
    JWT_ACCESS_TOKEN_KEY: ')r$/=H)y"V>j1;r',
    JWT_REFRESH_TOKEN_KEY: '^L/)Ec}d3g9!B,f',
  },
  transform: {},
  testRegex: '/tests/.*|(\\.|/)(test|spec)\\.([jt]sx?|[cm]js?)$',
  restoreMocks: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/src/config/', '/src/app.js', '/tests/'],
  testPathIgnorePatterns: [
    '<rootDir>/tests/helpers/',
    '<rootDir>/tests/fixtures/',
  ],
  testTimeout: 30000,
};

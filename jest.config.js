
module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/test'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node'
};

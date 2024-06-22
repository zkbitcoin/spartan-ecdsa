/* cspell:ignore lcov */

import type { Config } from '@jest/types';

const configuration: Config.InitialOptions = {
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['lcov', 'text', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  extensionsToTreatAsEsm: ['.ts'],
  injectGlobals: true,
  logHeapUsage: true,
  moduleNameMapper: {
    "@src/(.*)$": "<rootDir>/src/$1",
  },
  preset: 'ts-jest/presets/js-with-ts-esm',
  prettierPath: null,
  //resetMocks: true,
  //roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  testTimeout: 1200000,
};
export default configuration;

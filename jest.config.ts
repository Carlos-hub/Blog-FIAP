import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',
    '!src/app.ts', // exclude app bootstrap from coverage calculation (integration tests will cover routes)
    '!src/**/DTOs/**',
    '!src/**/Interfaces/**',
    '!src/**/mappers/**',
    '!src/**/Models/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.ts'],
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  }
};

export default config;


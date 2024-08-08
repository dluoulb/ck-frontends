import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  clearMocks: true,
  verbose: true,
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/shared/components/$1',
    '^@contexts$': '<rootDir>/shared/contexts',
    '^@hooks/(.*)$': '<rootDir>/shared/hooks/$1',
    '^@lib/(.*)$': '<rootDir>/shared/lib/$1',
    '^@apps/reports/(.*)$': '<rootDir>/apps/reports/$1',
    '^@pages/reports/(.*)$': '<rootDir>/pages/reports/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-instantsearch|react-instantsearch-core)/)',
  ],
};

export default createJestConfig(config);

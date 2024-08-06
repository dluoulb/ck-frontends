/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

const config: Config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/shared/components/$1',
    '^@contexts$': '<rootDir>/shared/contexts',
    '^@hooks/(.*)$': '<rootDir>/shared/hooks/$1',
    '^@lib/(.*)$': '<rootDir>/shared/lib/$1',
    '^@apps/reports/(.*)$': '<rootDir>/apps/reports/$1',
    '^@pages/reports/(.*)$': '<rootDir>/pages/reports/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
};

export default createJestConfig(config);

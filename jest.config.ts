import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  projects: ['<rootDir>/packages/*/jest.config.ts'],
};

export default config; 
export default {
  preset: 'ts-jest/presets/default-esm', // Use the ESM preset for ts-jest
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\..*)\\.js$': '$1', // Treat import paths with .js extension correctly
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
  },
};
module.exports = {
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
    coverageReporters: ['text', 'cobertura', 'lcov'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: ['**/test/**/*.test.(ts|js)'],
    testEnvironment: 'node',
    moduleDirectories: ['node_modules', '<rootDir>/src'],
    modulePathIgnorePatterns: ['<rootDir>/build/'],
}

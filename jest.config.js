
module.exports = {
    preset: "@shelf/jest-mongodb",
    roots: ["<rootDir>/test"],
    collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
    coverageDirectory: "coverage",
    testEnvironment: "node",
    transform: {
        ".+\\.ts$": "ts-jest"
    }
};

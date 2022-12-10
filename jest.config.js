
module.exports = {
    preset: "@shelf/jest-mongodb",
    roots: ["<rootDir>/test"],
    collectCoverageFrom: [
        "<rootDir>/src/**/*.ts",
        "!<rootDir>/src/main/**"
    ],
    coverageDirectory: "coverage",
    testEnvironment: "node",
    transform: {
        ".+\\.ts$": "ts-jest"
    }
};

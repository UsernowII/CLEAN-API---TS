export default {
    mongoURL: process.env.MONGO_URL || "mongodb://mongo:27017/clean-api-ts",
    port: process.env.PORT || 5050,
    jwtSecret: process.env.JWT_SECRET || "jwt??any"
};

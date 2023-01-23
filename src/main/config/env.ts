export default {
    mongoURL: process.env.MONGO_URL || "mongodb+srv://admin:Admin_2021@cluster0.fsbkp.mongodb.net/clean-api-ts",
    port: process.env.PORT || 5050,
    jwtSecret: process.env.JWT_SECRET || "jwt??any"
};

const jwt = require("jsonwebtoken");

const genrateAccessToken = function(userId){
    try {
        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new Error("ACCESS_TOKEN_SECRET is not defined.");
        }

        const accessToken = jwt.sign(
            {
                id: userId
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1h' // default to 1 hour if not defined
            }
        );
        return accessToken;
    } catch (error) {
        console.error("Error generating access token:", error);
        throw new Error("Could not generate access token.");
    }
}

const genrateRefreshToken = function(userId){
    try {
        if (!process.env.REFRESH_TOKEN_SECRET) {
            throw new Error("REFRESH_TOKEN_SECRET is not defined.");
        }

        const refreshToken = jwt.sign(
            {
                id: userId
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' // default to 7 days if not defined
            }
        );
        return refreshToken;
    } catch (error) {
        console.error("Error generating refresh token:", error);
        throw new Error("Could not generate refresh token.");
    }
}

module.exports = { genrateAccessToken, genrateRefreshToken };

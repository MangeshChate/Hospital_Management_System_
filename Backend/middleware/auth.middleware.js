
/**
 * This is an auth middleware which verify token , jwt
 */


const jwt = require('jsonwebtoken');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiError } = require('../utils/ApiError');
const prisma = require('../prisma/index');

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        
        const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request: No access token provided");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken?.id) {
            throw new ApiError(401, "Invalid access token");
        }

      
        const user = await prisma.user.findUnique({
            where: { id: decodedToken.id },
            select: {
                id: true,
                email: true,
                fullName: true,
                roles: true,
                createdAt: true,
                updatedAt: true
            },
        });

        if (!user) {
            throw new ApiError(401, "Invalid access token: User not found");
        }

       
        req.user = user;
        next();

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new ApiError(401, "Access token expired");
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new ApiError(401, "Invalid access token");
        } else {
            throw new ApiError(401, error.message || "Unauthorized request");
        }
    }
});

module.exports = verifyJWT;


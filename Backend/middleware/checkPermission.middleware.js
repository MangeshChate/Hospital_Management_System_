const { ApiError } = require("../utils/ApiError");
const { asyncHandler } = require("../utils/asyncHandler");
const prisma = require("../prisma/index");

/**
 * Middleware to check if the user has the required permission.
 * @param {string} requiredPermission - The permission needed to access the route.
 */
const checkPermission = (requiredPermission) => 
    asyncHandler(async (req, res, next) => {

        
        const userId = req.user?.id;
        if (!userId) {
            throw new ApiError(401, "User not authenticated");
        }

        // Fetch current user's roles and permissions
        const userRoles = await prisma.userRole.findMany({
            where: { userId },
            include: {
                role: {
                    include: {
                        permissions: true, 
                    }
                }
            }
        });

        // Check if user has any roles assigned
        if (userRoles.length === 0) {
            throw new ApiError(403, "User has no roles assigned");
        }

        // Check if any of the user's roles contain the required permission
        const hasPermission = userRoles.some((userRole) =>
            userRole.role.permissions.some(
                (permission) => permission.name === requiredPermission
            )
        );

       
        if (!hasPermission) {
            throw new ApiError(403, `User access need required permission: ${requiredPermission}`);
        }

 
        next();
    });

module.exports = checkPermission;

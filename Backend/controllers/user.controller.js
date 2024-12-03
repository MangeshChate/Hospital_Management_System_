/**
 * Controller for an user 
 * -genrate access & refresh token
 * -register
 * -login
 * -add role
 * -refresh token
 */

const genrateBcryptPassword = require("../auth/bcrypt.auth");
const isPasswordCorrect = require("../auth/isPasswordCorrect.auth");
const { genrateAccessToken, genrateRefreshToken } = require("../auth/tokenService.auth");
const prisma = require("../prisma");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/APiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const jwt = require('jsonwebtoken')


//genrate access&Token code
const generateAccessAndRefreshTokens = async (userId) => {
    try {

        const accessToken = genrateAccessToken(userId);
        const refreshToken = genrateRefreshToken(userId);


        await prisma.session.create({
            data: {
                userId: userId,
                refreshToken: refreshToken
            }
        });


        return { accessToken, refreshToken };

    } catch (error) {
        console.error("Error generating tokens:", error);
        throw new ApiError(500, "Something went wrong while generating token");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { email, fullName, password , createdBy ,updatedBy } = req.body;

    if (!email || !fullName || !password) {
        throw new ApiError(400, "All fields are required!");
    }

    const existingUser = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (existingUser) {
        throw new ApiError(409, "User with email already exists");
    }

    const bcryptPassword = await genrateBcryptPassword(password)


    const user = await prisma.user.create({
        data: {
            email: email,
            fullName: fullName,
            password: bcryptPassword,
            createdBy:createdBy || "self",
            updatedBy:updatedBy || "self"

        }
    });

    const createdUser = await prisma.user.findUnique({
        where: {
            id: user.id
        },
        select: {
            id: true,
            email: true,
            fullName: true,
            roles: true,
            createdBy:true,
            updatedBy:true,
            createdAt: true,
            updatedAt: true
        },
    });

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user!");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User registered successfully!")
        )



});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required!");
    }

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (!user) {
        throw new ApiError(404, "User not found!");
    }


    const isPasswordValid = await isPasswordCorrect(password, user.password);
    console.log(isPasswordValid)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials !");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);

    const loggedInUser = await prisma.user.findUnique({
        where: {
            id: user.id
        }, select: {
            id: true,
            email: true,
            fullName: true,
            roles: true,
            createdAt: true,
            updatedAt: true
        }
    });

    const options = {
        httpOnly: true,
        secure: true,
        sameSite:'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
                "User looged in successfully"
            )
        )


})

const logoutUser = asyncHandler(async (req, res) => {
    
    // console.log(req.cookies.refreshToken)

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    // console.log(incomingRefreshToken)
    const userId = req.user.id;

    if (incomingRefreshToken) {

        await prisma.session.delete({
            where: {
                refreshToken: incomingRefreshToken,
            },
        });
    } else {

        const userSessions = await prisma.session.findMany({
            where: { userId: userId },
        });

        for (const session of userSessions) {
            await prisma.session.delete({
                where: { id: session.id },
            });
        }
    }

    const options = {
        httpOnly: true,
        secure: true,
        sameSite:'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized Request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await prisma.user.findUnique({
            where: {
                id: decodedToken.id,
            }
        });

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token!");
        }

        const userSession = await prisma.session.findUnique({
            where: {
                userId: user.id,
                refreshToken: incomingRefreshToken
            }
        });

        if (!userSession) {
            throw new ApiError(401, "Expired or Invalid Refresh Token");
        }

        const options = {
            httpOnly: true,
            secure: true,
            sameSite:'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user.id);


        await prisma.session.update({
            where: {
                id: userSession.id
            },
            data: {
                refreshToken: newRefreshToken
            }
        });

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access Token and Refresh Token refreshed successfully"
                )
            );

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token!");
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            id: req.user?.id
        }
    });

    console.log(oldPassword, user?.password)
    const isPasswordValid = await isPasswordCorrect(oldPassword, user?.password);



    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid Password")
    }

    const bcryptPassword = await genrateBcryptPassword(newPassword)

    await prisma.user.update({
        where: { id: user.id },
        data: { password: bcryptPassword }
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Password Changed Successfully .")
        )

});

const getCurrentUser = asyncHandler(async (req, res) => {

   return res
        .status(200)
        .json(
            new ApiResponse(200, { user: req.user }, "User Retrieved Successfully .")
        );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { email, fullName ,password ,updatedBy } = req.body;

    if (!email || !fullName) {
        throw new ApiError(400, "All fields are required!");
    }
    const bcryptPassword = await genrateBcryptPassword(password)
    const user = await prisma.user.update({
        where: {
            id: req.user?.id
        },
        data: {
            fullName: fullName,
            email: email,
            password:bcryptPassword,
            updatedBy:updatedBy,
           
        },
        select: {
            id: true,
            email: true,
            fullName: true,
            roles: true,
            createdAt: true,
            updatedAt: true
        }
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Account details updated successfully!")
        )

});

const createRole = asyncHandler(async (req, res) => {
    const { name, permissions ,createdBy , updatedBy} = req.body;

    if (!name) {
        throw new ApiError(400, "Role name is required!");
    }

    const existingRole = await prisma.role.findUnique({
        where: {
            name: name.toUpperCase()
        }
    });

    if (existingRole) {
        throw new ApiError(400, "Role already exists!");
    }

    let permissionsToConnect = permissions?.map(permissionId => ({ id: permissionId })) || [];

    // If the role is 'ADMIN', add all permissions during the creation process
    if (name.toUpperCase() === 'ADMIN') {
        const allPermissions = await prisma.permission.findMany();
        permissionsToConnect = allPermissions.map(permission => ({ id: permission.id }));
    }

    
    const newRole = await prisma.role.create({
        data: {
            name: name.toUpperCase(),
            permissions: {
                connect: permissionsToConnect
            },
            createdBy:createdBy || "self",
            updatedBy:updatedBy || "self"
        }
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newRole, "Role created successfully!"));
});

const getRole = asyncHandler(async (req, res) => {

    const allRoles = await prisma.role.findMany();

    return res
        .status(201)
        .json(
            new ApiResponse(201, { allRoles }, "Roles are fetched successfully")
        )

})

const removeRole = asyncHandler(async (req, res) => {

    const { roleId } = req.body;

    await prisma.role.delete({
        where: {
            id: roleId
        }
    });

    return res
        .status(200)
        .json(
            new ApiResponse(201, {}, "Role Removed Successfully")
        )
})

const assignRoleToUser = asyncHandler(async (req, res) => {
    const { userId, roleId ,createdBy,updatedBy} = req.body;

    if (!userId || !roleId) {
        throw new ApiError(400, "userId & RoleId both are required !");
    }

    const userRole = await prisma.userRole.create({
        data: {
            userId,
            roleId,
            createdBy:createdBy || "self",
            updatedBy :updatedBy || "self"
        }
    });

    return res
        .status(200)
        .json(
            new ApiResponse(200, userRole, "Role assigned to user successfully")
        )

})

const getUserRoles = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const userRoles = await prisma.userRole.findMany({
        where: { userId: userId },
        include: { role: true },
    });

    return res
        .status(201)
        .json(
            new ApiResponse(201, { userRoles }, "Specific user roles fetched successfully")
        )
})

const getSpecificUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    console.log(id)
    
    if (!id) {
        throw new ApiError(400, "User ID is required!");
    }

  
    const userData = await prisma.user.findUnique({
        where: {
            id: id, 
        },
        include: {
            profile: true, 
        },
    });

   
    if (!userData) {
        throw new ApiError(404, "User not found!");
    }


    return res
        .status(200)
        .json(
            new ApiResponse(200, { userData }, "Specific user data fetched successfully")
        );
});

const getAllUsersWithRoles = asyncHandler(async (req, res) => {

    const users = await prisma.user.findMany({
        include: {
            roles: {
                include: {
                    role: true
                }
            }
        }
    })

    const usersWithRoles = users.map(user => ({
        ...user,
        roles: user.roles.map(userRole => userRole.role.name),
    }));

    return res
        .status(201)
        .json(
            new ApiResponse(201, { usersWithRoles }, "All Users with Roles Fetched successfully!")
        )
})





module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    createRole,
    getRole,
    assignRoleToUser,
    getUserRoles,
    getAllUsersWithRoles,
    removeRole,
    getSpecificUser
};


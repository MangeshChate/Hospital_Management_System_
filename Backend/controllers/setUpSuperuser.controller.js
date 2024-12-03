
/**
 * Developer Only SetUp Superuser for creating Admin firsttime. 
 */


const prisma = require("../prisma/index");
const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/APiResponse");
const { asyncHandler } = require("../utils/asyncHandler");




const createSuperuser = asyncHandler(async(req,res)=> {
    const existingRole = await prisma.role.findUnique({
        where:{
            name:'ADMIN'
        }
    });

    if(existingRole){
        throw new ApiError(400,"Admin role already exists. Superuser setup is already done.");
    }

    const allPermissions = await prisma.permission.findMany();

    const newAdminRole = await prisma.role.create({
        data:{
            name:'ADMIN',
            permissions:{
                connect:allPermissions.map(permission => ({ id: permission.id })) 
            }
        }
    });

    return res 
    .status(201)
    .json(
        new ApiResponse(201,newAdminRole,"Superuser (admin role) created successfully!")
    )

});


module.exports = {createSuperuser}
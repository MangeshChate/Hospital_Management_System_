/**
 * This Controller Is Crete Permission Only For One Time 
 * - Only Developer should Call this  Api   
 * - Changes in permissions may affect role-based 
 *   middleware
 * - Ones we post permission then there is no use of this controller 
 * 
 */


const { ApiResponse } = require("../utils/APiResponse");
const { asyncHandler } = require("../utils/asyncHandler");
const prisma = require("../prisma");



const createPermission = asyncHandler(async (req, res) => {
    const permissions = [
        { name: 'VIEW_DASHBOARD' },
        { name: 'CREATE_PATIENT' },
        { name: 'EDIT_PATIENT' },
        { name: 'DELETE_PATIENT' },
        { name: 'VIEW_REPORTS' },
        { name: 'GENERATE_REPORTS' },
        { name: 'MANAGE_USERS' },
        { name: 'MANAGE_ROLES' },
        { name: 'MANAGE_PERMISSIONS' },
        { name: 'VIEW_FINANCIALS' },
        { name: 'MANAGE_STAFF' }
    ];

    const permissionPromises = permissions.map(permission =>
        prisma.permission.upsert({
            where: { name: permission.name },
            update: {},  
            create: permission  
        })
    );

    // Run all the permission operations concurrently
    await Promise.all(permissionPromises);

    return res.status(201).json(
        new ApiResponse(201, {}, "Permissions is created successfully.")
    );
});

const getPermissionList = asyncHandler(async(req,res)=>{
    const permissions = await prisma.permission.findMany({
        select:{
            id:true,
            name:true
        }
    });

    return res 
    .status(200)
    .json(
        new ApiResponse(200,permissions, "permission list retrieved successfully .")
    )
})

module.exports = {createPermission,getPermissionList}


//Guide For Permission Details

    /** 
     * VIEW_DASHBOARD
     * Grants access to view the main dashboard interface, which typically includes 
     * an overview of key metrics and information relevant to the user's role. 
     * Example use: Admins, doctors, and nurses may need to see general hospital status, 
     * such as number of patients, staff availability, and alerts.
     */
    

    /**
     * CREATE_PATIENT
     * Allows the user to add new patient records to the system, including essential 
     * demographic and medical data.
     * Example use: Staff responsible for intake, such as nurses or front-desk administrators, 
     * who need to register new patients in the system.
     */
   

    /**
     * EDIT_PATIENT
     * Grants permission to modify existing patient records, such as updating contact details, 
     * diagnosis information, and medical history.
     * Example use: Healthcare providers (doctors, nurses) who need to update patient records 
     * after each appointment or treatment.
     */
   

    /**
     * DELETE_PATIENT
     * Allows the user to remove patient records from the system. Typically, this permission 
     * would be restricted to higher-level roles, as deletion can affect medical and legal records.
     * Example use: Admins with elevated rights to maintain accurate and legally compliant records.
     */
   
    /**
     * VIEW_REPORTS
     * Grants access to view various types of patient and operational reports, such as 
     * treatment progress, patient statistics, or hospital performance.
     * Example use: Doctors and managers who require insights for decision-making and patient care.
     */
   

    /**
     * MANAGE_USERS
     * Provides access to user management functions, allowing the creation, modification, 
     * or deactivation of user accounts.
     * Example use: Admins responsible for maintaining staff accounts and updating user roles as needed.
     */
  

    /**
     * VIEW_PATIENTS
     * Allows the user to view patient records and their details, including diagnosis 
     * and treatment plans.
     * Example use: Healthcare providers and support staff who need access to patient information 
     * to deliver care and manage workflows.
     */
  

    /**
     * MANAGE_ROLES
     * Grants permission to create, assign, or modify roles within the system, helping 
     * to define access levels for various users.
     * Example use: Admins responsible for setting up access control policies.
     */
    

    /**
     * MANAGE_PERMISSIONS
     * Allows managing the permissions linked to roles, ensuring proper access is granted 
     * based on each role's responsibilities.
     * Example use: Super Admins or designated security managers tasked with enforcing role-based 
     * access controls in the hospital system.
     */
   

    /**
     * VIEW_FINANCIALS
     * Grants access to financial data such as billing, invoices, and other monetary records. 
     * Example use: Financial administrators or accountants who need visibility into 
     * the hospital’s financial performance.
     */


    /**
     * GENERATE_REPORTS
     * Enables the user to generate new reports based on various metrics and data in the system, 
     * such as patient data, financial data, and system usage stats.
     * Example use: Management or senior staff who require custom reports for insights 
     * or strategic decision-making.
     */


    /**
     * MANAGE_STAFF
     * Allows adding, editing, or removing staff records and managing their schedules 
     * and assignments within the hospital.
     * Example use: HR personnel or department managers responsible for scheduling and 
     * allocating resources.
     */
 


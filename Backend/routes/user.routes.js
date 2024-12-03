
/**
 * @route   /api/v1/users
 * @desc    API routes for managing user operations, including user verification and role-based access control.
 * @version 1.0.0
 * @access  Protected - requires specific user permissions
 *
 * Permission Requirements:
 * These permissions are associated with specific actions within the user management scope.
 * Each permission is assigned based on user roles to control access to various system functionalities.
 *
 * List of Available Permissions:
 *
 * - VIEW_DASHBOARD:      Access to view the main dashboard and overview statistics.
 * - CREATE_PATIENT:      Permission to add new patient records to the system.
 * - EDIT_PATIENT:        Permission to modify existing patient information.
 * - DELETE_PATIENT:      Permission to remove patient records from the system.
 * - VIEW_REPORTS:        Access to view generated reports.
 * - GENERATE_REPORTS:    Permission to create and manage various reports.
 * - MANAGE_USERS:        Control over user account creation, modification, and deletion.
 * - MANAGE_ROLES:        Manage role assignments and role creation within the system.
 * - MANAGE_PERMISSIONS:  Control over assigning permissions to roles or users.
 * - VIEW_FINANCIALS:     Access to view financial data and reports.
 * - MANAGE_STAFF:        Permission to add, edit, or remove staff information and profiles.
 *
 * Note: Ensure that access to these routes is secured by appropriate middleware, checking
 * user permissions and roles to enforce secure role-based access control.
 */



const { Router } = require("express");
const { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, createRole, getRole, removeRole, assignRoleToUser, getUserRoles, getAllUsersWithRoles, getSpecificUser } = require("../controllers/user.controller");
const verifyJWT = require("../middleware/auth.middleware");
const checkPermission = require("../middleware/checkPermission.middleware");
const router = Router();


router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-account").post(verifyJWT, updateAccountDetails);

router.route("/create-role").post(verifyJWT, checkPermission('MANAGE_ROLES'),createRole);

router.route("/get-roles").get(getRole)

router.route("/remove-role").post(verifyJWT, checkPermission('MANAGE_ROLES'),removeRole)

router.route("/assign-role").post(verifyJWT, checkPermission('MANAGE_ROLES'),assignRoleToUser);

router.route("/:id/get-user-role").get(verifyJWT, getUserRoles);

router.route("/:id/get-specific-user").get(verifyJWT, getSpecificUser);

router.route("/get-all-users-with-role").get(verifyJWT, getAllUsersWithRoles);





module.exports = router;
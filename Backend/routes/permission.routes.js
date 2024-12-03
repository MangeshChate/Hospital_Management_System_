/**
 * @route   /api/v1/permission
 * @desc    Developer-only routes for managing permissions.
 * @access  Developer access only (requires 'x-developer-mode' header).
 * 
 * This route allows the creation and retrieval of permissions.
 * The creation route is protected by the 'developerOnly' middleware, which ensures 
 * that only requests with the correct developer mode key in the headers are allowed.
 */



const {Router} = require("express");
const { createPermission, getPermissionList } = require("../controllers/permission.controller");
const developerOnly = require("../middleware/developerAccess.middleware");
const router = Router();

router.route("/").post(developerOnly,createPermission);
router.route("/getPermissionList").get(getPermissionList);



module.exports = router;
/**
 * @route   /api/v1/superuser
 * @desc    Developer-only routes for managing permissions.
 * @access  Developer access only (requires 'x-developer-mode' header).
 * 
 * This route allows the creation of an superuser.

 */


const {Router} = require("express");

const developerOnly = require("../middleware/developerAccess.middleware");
const { createSuperuser } = require("../controllers/setUpSuperuser.controller");

const router = Router();



router.route("/").post(developerOnly,createSuperuser);




module.exports = router;
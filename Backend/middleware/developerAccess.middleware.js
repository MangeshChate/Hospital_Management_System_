/**
 * This middleware provide an developer-access 
 * - This middleware require 'x-developer-key'
 * 
 * - For Production Dummy x-developer-key
 *   is {92f86d15-f25d-4ec7-88b1-6b2d945efb3a}
 * 
 */

const { ApiResponse } = require("../utils/APiResponse");


const developerOnly = (req, res, next) => {
    const developerKey = req.headers['x-developer-key'];

   
    if (developerKey && developerKey === process.env.DEVELOPER_KEY) {
        return next(); 
    }

    
    return res.status(403).json(
        new ApiResponse(403, { message: "Access denied. Developer-only access." })
    );
};

module.exports = developerOnly;
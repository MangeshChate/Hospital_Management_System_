
/**
 * A wrapper for asynchronous route handlers to catch errors and pass them to the next middleware.
 * @param {Function} reqHandler - The async route handler to be wrapped.
 * @returns {Function} - A new function that handles errors automatically.
 */


const asyncHandler = (reqHandler) => {
    return (req,res,next)=>{
        Promise.resolve(reqHandler(req,res,next))
        .catch((err)=>next(err))
    }
}

module.exports= {asyncHandler}

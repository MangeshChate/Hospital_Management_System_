/**
 * App File
 * @editedBy Mangesh
 * @last_edit thu Nov 7
 */

const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');

const corsOptions = {
    origin: "http://localhost:3000", 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'], 
    credentials: true
};




//middleware 
app.use(cors(corsOptions));

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true,limit:'16kb'}));
app.use(express.static("public"));
app.use(cookieParser());

//routes imports
const userRouter =require("./routes/user.routes.js");
const permissionRouter = require("./routes/permission.routes.js");
const superuserRouter = require("./routes/superuser.routes.js");


//routes declaration 
app.use("/api/v1/users",userRouter)
app.use("/api/v1/permission",permissionRouter)
app.use("/api/v1/superuser",superuserRouter)






module.exports = app;
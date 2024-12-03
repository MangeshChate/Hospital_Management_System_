const bcrypt = require("bcrypt");


const genrateBcryptPassword =  function(password){
    return  bcrypt.hash(password,10);
    
}

module.exports = genrateBcryptPassword;
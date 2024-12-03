const bcrypt = require("bcrypt");

const isPasswordCorrect = async (enteredPassword, storedHashedPassword) => {
    try {
        
        if (typeof enteredPassword !== 'string' || typeof storedHashedPassword !== 'string') {
            throw new Error('Both passwords should be strings.');
        }
        const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);
        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        throw new Error('Password comparison failed');
    }
};

module.exports = isPasswordCorrect;

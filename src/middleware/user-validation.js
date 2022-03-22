const { body } = require('express-validator')

exports.validate = (method) => {
  switch (method) {
    case 'createUser': {
     return [ 
        body('name', "username must have more than 5 characters").exists().isLength({ min: 5 }).trim().stripLow().escape(),
        // body('email', "not a valid email address").isEmail(),
        // body('phone', "not a valid phone number").isMobilePhone(),
        body('password', "password must have include minimum 8 characters, 1 capital character, 1 lower character, 1 special character and 1 number").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
        body('type', "Type must be Admin or User").isIn(["Admin", "User"]),
        body('status', "Status must be 0 or 1").isIn(["0", "1"]),
       ]   
    }
    case 'updateUser': {
     return [ 
        body('name', "username must have more than 5 characters").exists().isLength({ min: 5 }).trim().stripLow().escape(),
        // body('email', "not a valid email address").isEmail(),
        // body('phone', "not a valid phone number").isMobilePhone(),
        body('password', "password must have include minimum 8 characters, 1 capital character, 1 lower character, 1 special character and 1 number").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
        body('type', "Type must be Admin or User").isIn(["Admin", "User"]),
        body('status', "Status must be 0 or 1").isIn(["0", "1"]),
       ]   
    }
  }
}
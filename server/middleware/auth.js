const jwt = require('jsonwebtoken');

const secret = 'jwtSecret';

// @router GET api/auth
// @desc Get user by token 
// @access Private  

module.exports = (req, res, next) => {
    console.log('hello from auth Middleware');

    const token = req.header('x-auth-token');
    console.log(token);
    if(!token) {
        return res.status(401).json({
            error: 'no token, authorization denied' , 
        });
    }
    try{
        jwt.verify(token, secret, (error, decoded) => {
            if(error) {
                return res.status(401).json({msg: 'Token not valid'});
            }else{
                req.user = decoded.user;
                next();
            }
        });


    }catch(err){
        console.error(JSON.stringify(err));
        return res.status(500).json({
            msg: "server error "
        });
    }
};
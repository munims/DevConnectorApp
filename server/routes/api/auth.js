const express = require('express');
const auth = require('../../middleware/auth');

const router   = express.Router();

// @router GET api/auth
// @desc Get user by token 
// @access Private  

router.get("/", auth, function(req, res) {
    res.json({
        message: "Hello from auth!",
    });
});
module.exports =router;
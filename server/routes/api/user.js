const bcrypt = require('bcryptjs');
const express = require('express');
const { validationResult, check } = require('express-validator');
const jwt  = require('jsonwebtoken');
//const { check, validationResult } = require("express-validator");

const users = require('../../models/users');

const router   = express.Router();

router.get("/", function(req, res) {
    res.json({
        message: "Hello from users!",
    });
});

/*
@end point: /api/users/register
method: POST
description : to register the user with the specified details
register: we are going to create a new user
new entity: post method from http protocol

*/
router.post("/register", 
        check("name", "name is required").notEmpty(), 
        check("email", "email is required").isEmail(),  
        check("password", "pls include the valid password").isLength({ min: 6 }),
    async(req, res) => {
        console.log(req.headers);
        console.log(JSON.stringify(req.body));

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log("Inside the validation function");
        return res.status(400).json({errors: errors.array()});
    }
    const { name, email, password } = req.body;

    /*
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    */

    try {

        const user2 = await users.findOne({ email });

        if (user2) {
            return res.status(400).json({ error: "User already Exists" });
        }
        const salt = await bcrypt.genSalt(10)
        //password = await bcrypt.hash(password, salt)
        let user = new users({name, email, password});
        user.password = await bcrypt.hash(password, salt)
        await user.save();

        const payload = {
            user:{
                id:user.id,
            }
        };

        //console.log(payload);

        jwt.sign(payload, "jwtSecret", {expiresIn: "5 day" }, (error, token) => {
            if (error){
                throw error;
            }
            return res.status(201).json({
                token,
            });
        });
        /*res.status(201).json({
            message: "Register post created successfully",
            });
            */

    }
    catch (error) {    
        console.log("Inside CatchError");
                
        console.log(JSON.stringify(error.message));
            res.status(400).json({error});
    }

    //const name = req.body.name;

    
});

module.exports =router;
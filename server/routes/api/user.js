const express = require('express');
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
router.post("/register", async(req, res) => {
    console.log(req.headers);
    console.log(JSON.stringify(req.body));

    const { name, email, password } = req.body;

    /*
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    */

    try {
        let user = new users({name, email, password});
        await user.save();
        res.status(201).json({
            message: "Register post created successfully",
            });

    }
    catch (error) {            
        console.log(JSON.stringify(error));
            res.status(400).json({error});
    }

    //const name = req.body.name;

    
});

module.exports =router;
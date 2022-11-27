const express = require('express');

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
router.post("/register", (req, res) => {
    console.log(req.headers);
    console.log(JSON.stringify(req.body));

    res.status(201).json({
    message: "Register post created successfully",
    });
});

module.exports =router;
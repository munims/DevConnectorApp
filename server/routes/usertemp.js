// router : to handle routing for the specific part. // auth
// we need to load the express module

const { response } = require("express");
const express = require("express");
const { check, validationResult } = require("express-validator");
const users = require("../../models/users");

const router = express.Router();

router.get("/", function (req, res) {
  res.json({
    message: "Hello from users!",
  });
});
/*
@ end point : /api/users/register
method : POST
description : to register the user with the specified details
register : we are going to create a new user 
new entity : post method from http protocol

*/
router.post(
  "/register",
  check("name", "name is reqd"),
  check("email", "pls include the valid email").isEmail(),
  check("password", "pls include the valid password").isLength({ min: 6 }),
  async (req, res) => {
    console.log(req.headers);
    console.log(JSON.stringify(req.body));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("inside the validation result");
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    // const name = req.body.name;
    // const email = req.body.email;
    // const password = req.body.password;

    try {
      let user = new users({ name, email, password });
      await user.save(); // will save / stor the details into mongodb collection called user.
      res.status(201).json({
        message: "Register post called successfully",
      });
    } catch (error) {
      console.log(JSON.stringify(error));
      res.status(400).json({ error });
    }
    // destructuring : we are going to extract
    // name and password email from the req.body
  }
);

module.exports = router;

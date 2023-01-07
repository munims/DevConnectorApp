const express = require('express');
const { validationResult, check } = require('express-validator');

const profile = require('../../models/profiles');
const user = require('../../models/users');
const auth = require('../../middleware/auth');

const normalize = require('normalize-url');

const router   = express.Router();

/*
router.get("/", function(req, res) {
    res.json({
        message: "Hello from profile!",
    });
});
*/

//route: Post /api/profile
// @Desc: create or update a profile
// @access : private(needs token) // validation of token

router.post(
    '', 
    auth,
    check('status', 'Status is required').notEmpty(), 
    check('skills', 'Skills are required').notEmpty(), 

    async (req, res) => {
        console.log(req.headers);
        console.log(JSON.stringify(req.body));

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log("Inside the validation function api/profile.js");
            return res.status(400).json({errors: errors.array()});
        }

        const {
            website,
            skills,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,
            // spread the rest of the fields we don't need to check
            ...rest
          } = req.body;
          
          console.log(JSON.stringify(req.user));
          console.log("id value is" + JSON.stringify(req.user.id));

          const profileFields ={
            user: req.user.id,
            website: website && website !==''? normalize(website, {forceHttps:true}):"",
            skills: Array.isArray(skills) ? skills : skills.
            split(",").map((skill)=> "" + skill.trim()),
           // ...rest,
          };

          const socialFields = {youtube, twitter, facebook, linkedin, instagram};
          profileFields.social = socialFields;

          //let profileResult = null;
          //start adding the details to mongodb via mongoose
          try{
            console.log("Inside try before profile creation ");
             let profileResult = await profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true, upsert: true},
            );
            console.log("profile Result: " + profileResult);
            return res.status(201).json(profileResult);
          }catch(err){
            return res.status(201).json(profileResult);
          }

          


          return res.status(201).json(profileFields);     

    }
);

// @route    GET api/profile/
// @desc     Get all profiles
// @access   Public
router.get("/", auth, async (req, res) => {
  try {
    const profiles = await profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// @route    GET api/profile/me
// @desc     Get all profiles
// @access   Private
router.get("/me", auth, async (req, res) => {
  // const profileObj = null;
  try {
    const profileObj = await profile
      .findOne({
        user: req.user.id,
      })
      .populate("user", ["name", "avatar"]);

    if (!profileObj) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profileObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove user posts
    // Remove profile
    // Remove user
    await Promise.all([
      //Post.deleteMany({ user: req.user.id }),
      profile.findOneAndRemove({ user: req.user.id }),
      user.findOneAndRemove({ _id: req.user.id })
    ]);

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
  "/experience",
  auth,
  check("title", "Title is required").notEmpty(),
  check("company", "Company is required").notEmpty(),
  check("from", "From date is required and needs to be from the past")
    .notEmpty()
    .custom((value, { req }) => (req.body.to ? value < req.body.to : true)),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const profileObj = await profile.findOne({ user: req.user.id });

      profileObj.experience.unshift(req.body);

      await profileObj.save();

      res.json(profileObj);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);


module.exports =router;
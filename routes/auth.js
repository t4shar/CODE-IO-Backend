const express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require('../Middleware/fetchuser')
const router = express.Router();
const User = require("../modals/User");
const { body, validationResult } = require("express-validator");

// Route 1 Create a user using : POST "/api/auth/"

const JWT_TOKEN = "Thisisbetter&farbetterthen&me";

router.post(
  "/createuser",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Enter a valid Password").isLength({ min: 5 }),
    body("name", "Enter a valid name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // finding user with the same email is present or not
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with same email is already exits" });
      }

      const salt = await bcrypt.genSalt(10);
      const securepassword = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securepassword,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const auth_token = jwt.sign(data, JWT_TOKEN);
      // console.log(Jwt_data)
      res.json({ auth_token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 2 Authenticate a user a user using : POST "/api/auth/login : NO login required"

router.post('/login',[
  body('email','Enter a Valid Email').isEmail(),
  body('password','Password must be atleast 5 characteristics').isLength()
], async (req,res)=>{
  
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const{email,password}=req.body;
    try {
      let user = await  User.findOne({email});
      if(!user) return res.status(400).json({error : "User Not found"})
      
      const passwordcompare = await bcrypt.compare(password,user.password)
      
      if(!passwordcompare) return res.status(400).json({error : "Try to login with correct cruddentials"})
      
      const data = {
        user: {
          id: user.id,
        },
      };
      
      const auth_token = jwt.sign(data, JWT_TOKEN);
      res.json({auth_token})
      
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })
  // Route 3 Get user login detail a user a user using : POST "/api/auth/getuser :  login required"
  
  router.post('/getuser', fetchuser , async (req,res)=>{

        try {
          const userID=req.user.id
          const user = await User.findOne({userID}).select('password')
          res.send(user);
        } catch (error) {
          console.error(error.message);
          res.status(500).send("Internal Server Error");
          
        }
  })


  module.exports = router;
  
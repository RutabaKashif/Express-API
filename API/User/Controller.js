// const User = require('./Model')
// const { connect } = require('mongoose')
// require('dotenv').config()
// const { hash, compare } = require('bcryptjs')
// const { sign } = require('jsonwebtoken')


// const Login = async (req, res) => {
//     const { Name, Email, Password } = req.body

//     if (!Email || !Password) {
//         res.status(403).json({
//             message: "Missing Required Field"
//         })
//     }

//     else {

//         try {
//             await connect(process.env.MONGO_URI)
//             const CheckUser = await User.findOne({ Email })

//             if (!CheckUser) {
//                 res.status(404).json({
//                     message: "User Doesn't Exist"
//                 })
//             }

//             else {

//                 const decryptPassword = await compare(Password, CheckUser.Password)

//                 if (Email == CheckUser.Email && decryptPassword) {

//                     const UserData = {
//                         Email: CheckUser.Email,
//                         _id: CheckUser._id,
//                         Role: CheckUser.Role,
//                         ProfilePic: CheckUser.ProfilePic,
//                         Joining: CheckUser.Joining
//                     }

//                     const token = sign(UserData, process.env.JWT_SECRET)

//                     res.json({
//                         message: "Successfully Logginned",
//                         token
//                     })
//                 }

//                 else {
//                     res.status(403).json({
//                         message: "Invalid Credentails"
//                     })
//                 }
//             }

//         }

//         catch (error) {
//             res.json({
//                 message: error.message
//             })
//         }
//     }
// }



// const Signup = async (req, res) => {

//     const { Name, Email, Password } = req.body

//     if (!Name || !Email || !Password) {
//         res.status(403).json({
//             message: "Missing Required Field"
//         })
//     }

//     else {

//         try {
//             await connect(process.env.MONGO_URI)

//             const CheckUser = await User.findOne({ Email })

//             if (CheckUser) {
//                 res.json({
//                     message: "User Already Exist"
//                 })
//             }

//             else {
//                 await User.create({ Name, Email, Password: await hash(Password, 12) })
//                 res.json({
//                     message: "Successfully Created"
//                 })
//             }





//         }

//         catch (error) {
//             res.json({
//                 message: error.message
//             })
//         }

//     }




// }


// const getAllUsers = async (req, res) => {

//     try {
//         await connect(process.env.MONGO_URI)
//         const users = await User.find()

//         res.json({ users })
//     }

//     catch (error) {
//         res.json({
//             message: error.message
//         })
//     }



// }

// const updateProfile = async (req, res) => {

//     const { _id, Email, Name, ProfilePic } = req.body

//     const filter = { _id };
//     const update = { Email, Name, ProfilePic };

//     try {
//         await connect(process.env.MONGO_URI)
//         const updated = await User.findOneAndUpdate(filter, update, {
//             new: true
//         })

//         res.json({
//             message: "successs",
//             user: updated
//         })
//     }

//     catch (error) {
//         res.json({
//             message: error.message
//         })
//     }

// }


// const userByID = async (req, res) => {

//     const { _id } = req.query


//     try {
//         await connect(process.env.MONGO_URI)
//         const user = await User.findOne({ _id })

//         res.json({ user })
//     }

//     catch (error) {
//         res.json({
//             message: error.message
//         })
//     }
// }

// const deleteUser = async (req, res) => {

//     const { _id } = req.body

//     try {
//         await connect(process.env.MONGO_URI)
//         await User.deleteOne({ _id })

//         res.json({ message: "User Deleted Successfully" })
//     }

//     catch (error) {
//         res.json({
//             message: error.message
//         })
//     }
// }

// module.exports = { Login, Signup, deleteUser, updateProfile, userByID, getAllUsers }


const User = require("./Model");
const { connect } = require("mongoose");
require("dotenv").config();
const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const Signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing Required Field" });
  }

  try {
    const CheckUser = await User.findOne({ email: email.toLowerCase() });

    if (CheckUser) {
      return res.status(409).json({ message: "User Already Exist" });
    }

    const hashedPassword = await hash(password, 12);
    await User.create({ name, email: email.toLowerCase(), password: hashedPassword });

    return res.status(201).json({ message: "Successfully Created" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing Required Field" });
  }

  try {
    const CheckUser = await User.findOne({ email: email.toLowerCase() });

    if (!CheckUser) {
      return res.status(404).json({ message: "User Doesn't Exist" });
    }

    // Password comparison.
    const isValidPassword = await compare(password, CheckUser.password);

    // Log for debugging purposes.
    console.log('Password check:', isValidPassword);

    if (isValidPassword) {
      const UserData = {
        email: CheckUser.email,
        _id: CheckUser._id,
        role: CheckUser.role,
        ProfilePic: CheckUser.ProfilePic,
        Joining: CheckUser.Joining,
      };

      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not set.");

        return res.status(500).json({ message: "Server error: JWT_SECRET is missing." });
      }

      const token = sign(UserData, process.env.JWT_SECRET);

      return res.json({ message: "Successfully Logged in", token });
    } else {
      // This is where you're currently getting an error.
      console.log('User entered password:', password); // Temporarily for debugging.
      console.log('Stored hashed password:', CheckUser.password); // Temporarily for debugging.
      return res.status(403).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    await connect(process.env.MONGO_URI);
    const users = await User.find();

    res.json({ users });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  const { _id, email, name, ProfilePic } = req.body;

  const filter = { _id };
  const update = { email, name, ProfilePic };

  try {
    await connect(process.env.MONGO_URI);
    const updated = await User.findOneAndUpdate(filter, update, {
      new: true,
    });

    res.json({
      message: "successs",
      user: updated,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

const userByID = async (req, res) => {
  const { _id } = req.query;

  try {
    await connect(process.env.MONGO_URI);
    const user = await User.findOne({ _id });

    res.json({ user });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const { _id } = req.body;

  try {
    await connect(process.env.MONGO_URI);
    await User.deleteOne({ _id });

    res.json({ message: "User Deleted Successfully" });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};


module.exports = {
  Login,
  Signup,
  deleteUser,
  updateProfile,
  userByID,
  getAllUsers,
};
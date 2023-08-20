const express = require('express')
const router = express.Router()

const { Login, Signup, deleteUser, updateProfile, userByID, getAllUsers } = require('./Controller')


router.post('/login', Login)
router.post('/signup', Signup)
router.get('/getalluser', getAllUsers)
router.get('/getuserbyid', userByID)
router.delete('/delete-user', deleteUser)
router.put('/update-profile', updateProfile)




module.exports = router
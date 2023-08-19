const app = require('express')
const router = app.Router()
const {getallCategories, setCategorybyID, createCategory, updateCategory, deleteCategory} = require('./Controller')

router.get('/get-all-categories', getallCategories)
router.get('/get-category-by-id', setCategorybyID)
router.post('/create-category', createCategory)
router.put('/update-category', updateCategory)
router.delete('/delete-category', deleteCategory)

  
  module.exports = router
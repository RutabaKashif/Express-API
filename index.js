const express = require('express')
const app = express()
require('dotenv').config()
const CategoryRouter = require('./API/Category/Router')
const UserRouter =  require('./API/User/Router')
const ProductRouter =  require('./API/Products/Router')

const port = process.env.SERVER_PORT || 3500

app.use(express.json())
app.use('/api' , CategoryRouter)
app.use('/api', UserRouter)
app.use('/api', ProductRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
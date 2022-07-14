const connecttomongo = require('./db')
const express = require('express')
connecttomongo();
const roter = express.Router()
const app = express()
const port = 5000

// midlle ware to use to req 
app.use(express.json()) 

// Maintain available routes in routes folder 

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


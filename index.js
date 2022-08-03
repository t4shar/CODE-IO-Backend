const connecttomongo = require('./db')
connecttomongo();
const express = require('express')
var cors = require('cors')
const app = express()
const port = 5000
app.use(cors());
// midlle ware to use to req 
app.use(express.json()) 

// Maintain available routes in routes folder 

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


const connecttomongo = require('./db')
var request = require('request');
var axios = require('axios')
connecttomongo();
const express = require('express')
var cors = require('cors');
const { response } = require('express');
const app = express()
const port = 5000
app.use(cors());
// midlle ware to use to req 
app.use(express.json()) 
app.get('/',(req,res) =>{
    res.send('hello')
})


app.post('/compilecode',  async (req,res)=>{

  try {
    
  

  var program = {
    script : req.body.code,
    language: req.body.language,
    stdin : req.body.input,
    versionIndex: "4",
    clientId: "3036a6121dc6a308e3f43738f869351f",
    clientSecret:"6a576d149764e31af0bfb0c576309cc1bb2c4eb3213a3dbd2dcc5f423c5c298f"
};
request({
    url: 'https://api.jdoodle.com/v1/execute',
    method: "POST",
    json: program
},
function (error, response, body) {
  if(error != null){
    res.status(400).json({success: false , err: error })
  }else{
    console.log('statusCode:', response && response.statusCode);
      console.log('body:', body);
      res.status(200).json({success : true , "output" : body.output})
  }
})
} catch (error) {
  res.status(500).json({success : false , err : "SOME INTERNAL ERROR OCCURED"})  
}

})
// Maintain available routes in routes folder 

app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


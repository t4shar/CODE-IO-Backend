const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/inotebook';

const connecttomongo = ()=>{
    mongoose.connect(url,()=>{
        return console.log("Connected");
    })
}

module.exports = connecttomongo;    
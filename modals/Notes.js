const mongoose = require('mongoose')
const { Schema } = mongoose;

const notesSchema = new Schema({
  tile:{
    type:String,
    required : true
  },
  tag:{
    type:String,
    required : true
  },
  description : {
    type:String,
    required : true
  }
});

module.exports = mongoose.model('notes',notesSchema);
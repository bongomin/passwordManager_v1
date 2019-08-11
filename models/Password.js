const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a schema for passwords

const PasswordSchema = new Schema({
    systemName : {
        type : String,
        required : true
    },
    userName :{
        type :String,
        required : true
    },
    passWord :{
        type:String,
        required :true
    },
    date: {
        type: Date,
        default: Date.now
      }

});

// mongoose.model('passwords',PasswordSchema);
mongoose.model('passwords', PasswordSchema);
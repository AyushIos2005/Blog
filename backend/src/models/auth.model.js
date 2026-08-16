const mon = require("mongoose");

const userSchema = new mon.Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    status : {
        type : Boolean,
        default : false
    },
    resetOtp : {
        type : String
    },
    resetOtpExpires : {
        type : Date
    }
})

const authModel = mon.model("User",userSchema);
module.exports = authModel;
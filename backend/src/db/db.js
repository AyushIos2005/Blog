const mon = require("mongoose");

async function db(){
    try{
        await mon.connect(process.env.MON_URI)
        console.log("The Database connected Succefully")
    }
    catch(err){
        console.log("The Error is MONDB URI")
    }
}

module.exports = db;
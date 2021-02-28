/*
* The helper library
*/

// Dependencies
const crypto = require('crypto')

const config = require('../config')

// Creating the container
const helpers = {}

helpers.parseJsonToObject = (str)=>{
    
    if(!typeof(str)==='string' || str.length < 1){
        return false;
    }
    return JSON.parse(str);
}

helpers.encryptString = (str)=>{
    if(!typeof(str)==='string' || str.length < 1){
        return false;
    }

    return crypto.createHmac('SHA256', config.hashingSecret).update(str).digest('hex');
}


module.exports = helpers;
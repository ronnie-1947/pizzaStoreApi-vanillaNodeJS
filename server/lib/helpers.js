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


helpers.createRandomString = (strLength = 10)=>{ 

    strLength = typeof(strLength)== 'number' && strLength.length >0?strLength:10;
    
    const hash = crypto.randomBytes(strLength).toString('hex');
    return hash;
}

module.exports = helpers;
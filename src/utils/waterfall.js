var async =  require('async');
var request=require('request');
var URL="http://localhost:8000";

async.waterfall([
  (callback) => {
    console.log('start!');
    callback(null,"body1");
    // request(URL+'/xyz',(err,res,body) =>{
    //   if(err){
    //      callback(err);
    //   }else{
    //      console.log("Response 1 "+body)
    //      callback(null,body);
    //   }
    // })
  },

  (arg, callback) => {
    callback(null,"body2");
      
    // request(URL+'/abc'+JSON.parse(arg), (err,res,body) =>{
    //   if(err){
    //      callback(err);
    //   }else{
    //      console.log("Response 2 "+body)
    //      callback(null,body);
    //   }
    // })
  },
  
  (arg, callback) => {
    callback(null,"body3");
    // request(URL+'/qwerty'+JSON.parse(arg),(err,res,body) =>{
    //   if(err){
    //      callback(err);
    //   }else{
    //      console.log("Response 3 "+body)
    //      callback(null);
    //   }
    // })   
  }
],
 (err) => {
  if (err) {
    throw new Error(err);
  } else {
    console.log('No error happened in any tasks, all tasks done!');     
  }
});
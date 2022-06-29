var async =  require('async');
var request=require('request');
var URL="http://localhost:8000";

async.parallel([
  function task2(callback) {
    callback(null,"body1");
//     request(URL+'/abc',function(err,res,body){
//       if(err){
//          callback(err);
//       }else{
//          console.log("Response 2 "+body)
//          callback(null,body);
//       }
//     })
  },
   function task1(callback) {
    console.log('start!');

    callback(null,"body2");

    // request(URL+'/zxc',function(err,res,body){
    //   if(err){
    //      callback(err);
    //   }else{
    //      console.log("Response 1 "+body)
    //      callback(null,body);
    //   }
    // })
  },
  function task3(callback) {
    callback(null,"body3");

    // request(URL+'/qwerty',function(err,res,body){
    //   if(err){
    //      callback(err);
    //   }else{
    //      console.log("Response 3 "+body)
    //      callback(null,body);
    //   }
    // })   
  }
],
function (err,results) {
  if (err) {
    throw new Error(err);
  } else {
    console.log('No error happened in any tasks, all tasks done!');
    console.log("Results "+results.length+"  "+results)     
  }
});
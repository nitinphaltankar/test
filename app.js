var Express = require('express');
const bodyParser = require('body-parser');
//var app = Express();
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json({limit: '50mb'}));
var cors = require('cors')

const crypto = require('crypto');
const md5 = require('md5');
//var multer = require('multer');

global.storagePath = "Images";
var TestCaseId = ""; 

var expressMongoDb = require('express-mongo-db');
let jwt = require('jsonwebtoken');

var config = require('./config')
var ObjectId = require('mongodb').ObjectId ;
MongoClient = require('mongodb').MongoClient;

var response = {};   
var querystring = require('querystring');
var request = require('request');

function hashPassword(password) {

  return crypto.createHash('md5').update(password).digest('hex');
   //console.log(password);

}


class HandlerGenerator_v10 {

  index (req, res) {
    res.json({
      success: true,
      message: 'Index page'
    });
  }


  login (req, res) {

    // new code should come over here
    req.db.collection('users').findOne({mobile: req.body.mobile}, function(err, result){
        if(err) {
            response = {"error" : true, "message" : err};
            res.json(response);
        }
        else if(result){

          //if (req.body.password != result.password){
          if (hashPassword(req.body.password) != result.password){
              response = {"error" : true, "message" : "Password entered is invalid"};
              res.json(response);
              //console.log('Invalid Password');
          }else{
              console.log(result);
              let token = jwt.sign({username: req.body.mobile},
                config.secret,
                { expiresIn: '1h' // expires in 24 hours
                }
              );
              response = {"error" : false, "message" : "SUCCESS","user_detailes":result,"token": token};
              res.json(response);
              //console.log('success');
          }  

        }
        else {
          response = {"error" : JSON.stringify(err), "message" : JSON.stringify(result)};
          res.json(response);


          // response = {"error" : true, "message" : "Mobile Number entered is not registered with Gramsetu"};
          // res.json(response);
          //console.log('Invalid User ID');
        }
    });


  }



  registerUser(req, res) {

    var userObj = {
      "name": req.body.name,
      "mobile": req.body.mobile,
      "email": req.body.email,
      "otp_verified": "0",
      "otp": "1234",
      "password": hashPassword(req.body.password),
      "user_type": req.body.user_type, 
      "profile_photo": req.body.profile_photo
    }

    req.db.collection('users').findOne({mobile: req.body.mobile}, function(err, result){
          //console.log(result);
          if(result==null) {
                 
                   req.db.collection('users').insert(userObj, function(err, result) {
                   if(err) {
                              response = {"error" : true, "message" : result,"user_id":''};
                               res.json(response);
                           }  else {
                                      let _user_id = result["ops"][0]["_id"];
                                       response = {"error" : false, "message" : "SUCCESS","user_id":_user_id};
                                       res.json(response);

                                    }
                   })
          }
          else{
             response = {"error" : true, "message" : "Mobile Number  Already Exist !!"};
             res.json(response);
             //console.log(" data is present")
          }
              
      });
  }

  updateUserProfile(req, res) {

    console.log ("req.body : " + req.body);

    var userObj = {
      "_id":req.body._id,
      "name": req.body.name,
      "email": req.body.email,
      "profile_photo": req.body.profile_photo
    }

    req.db.collection('users').update({_id:userObj._id}, userObj, { upsert: false } ,function(err, result) {
          if(err) {
             response = {"error" : true, "message" : err};
             res.json(response);
          }
          else{
             response = {"error" : false, "message" : "SUCCESS"};
             res.json(response);
          }
              
      });
  }

  changePassword(req, res) {
    var userObj = {
      "_id":req.body._id,
      password: hashPassword(req.body.password),
    }

  req.db.collection('users').update({_id:o_id}, userObj, { upsert: false } ,function(err, result) {
        if(err) {
           response = {"error" : true, "message" : err};
           res.json(response);
        }
        else{
           response = {"error" : false, "message" : "SUCCESS"};
           res.json(response);
        }
            
    });
  }


  requesterDetailes (req, res) {
    
    console.log(req.body.user);


    var userObj = {
        "patient_name":req.body.patient_name, 
        "patient_photo":req.body.patient_photo,
        "patient_gender":req.body.patient_gender,
        "patient_age":req.body.patient_age,
        "patient_address_type":req.body.patient_address_type,
        "patient_address":req.body.patient_address,
        "patient_ward_no":req.body.patient_ward_no,
        "patient_no":req.body.patient_no,
        "patient_ailment":req.body.patient_ailment,
        "patient_from_datetime":req.body.patient_from_datetime,
        "patient_to_datetime":req.body.patient_to_datetime,
        "patient_family_no1":req.body.patient_family_no1,
        "patient_family_no2":req.body.patient_family_no2,
        "patient_doctor_no1":req.body.patient_doctor_no1,
        "patient_doctor_no2":req.body.patient_doctor_no2,
        "relation_with_patient":req.body.relation_with_patient,
        "requester_address":req.body.requester_address,
        "requester_area":req.body.requester_area,
        "requester_pin":req.body.requester_pin,
        "requester_phone1":req.body.requester_phone1,
        "requester_phone2":req.body.requester_phone2,
        "requester_phone3":req.body.requester_phone3,
        "patient_id_proof_type":req.body.patient_id_proof_type,
        "patient_id_proof":req.body.patient_id_proof,
    }

    let server_url = req.body.server_url; 
    let images = req.body.images;
    let img_arr = new Array();

    console.log( userObj);

    req.db.collection('request_details').findOne({mobile: req.body.mobile}, function(err, result)
    {
      //console.log(result);
      if(result==null) 
      {

       req.db.collection('request_details').insert(userObj, function(err, result) 
       {
         if(err) 
         {
          response = {"error" : true, "message" : result,"user_id":''};
          res.json(response);
        }  else 
        {
          let _user_id = result["ops"][0]["_id"];
          response = {"error" : false, "message" : "SUCCESS","user_id":_user_id};
          res.json(response);

        }
      })
     }
     else{
       response = {"error" : true, "message" : "Mobile Number  Already Exist !!"};
       res.json(response);
       }

     });

  }



}


// Starting point of the server
function main () {

  let app = Express(); // Export app for other routes to use
  let handlers_v10 = new HandlerGenerator_v10();
  app.use(bodyParser.urlencoded({ // Middleware
    limit: '50mb',extended: true
  }));
  app.use(bodyParser.json({limit: '50mb'}));

  app.use(cors());
  app.use(expressMongoDb(config.database.url));

  app.use(Express.static(__dirname + '/Images'));

  let middleware = require('./middleware');

  // Version 1.0 APIs

  app.post('/api/v10/login', handlers_v10.login);
  app.post('/api/v10/registerUser', handlers_v10.registerUser);
  app.post('/api/v10/requesterDetails/add', middleware.checkToken, handlers_v10.requesterDetailes);
  app.post('/api/v10/updateUserProfile', middleware.checkToken, handlers_v10.updateUserProfile);
  app.post('/api/v10/changePassword', middleware.checkToken, handlers_v10.changePassword);

  // Version 1.0 APIs  

  //const port = 3000;
  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`Server is listening on port: ${port}`));
  
}

main();




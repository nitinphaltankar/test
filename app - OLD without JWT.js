var Express = require('express');
const bodyParser = require('body-parser');
var app = Express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({limit: '50mb'}));
var cors = require('cors')
app.use(cors());

global.storagePath = "Images";

var expressMongoDb = require('express-mongo-db');

var config = require('./config')
app.use(expressMongoDb(config.database.url));
var ObjectId = require('mongodb').ObjectId ;

app.get('/api/getRequests', function(req, res, next) { 
  var response = {};

  // fetch and sort users collection by id in descending order
  req.db.collection('request_details').find().sort({"_id": -1}).toArray(function(err, result) {
  
       if(err) {
                response = {"error" : true,"message" : "Error fetching data : " + err};
            } else {
                response = {"error" : false, "message" : result};
                res.json(response);
            }
  })

})


app.post("/api/registerUser", function(req, res) {

    console.log(req.body.user);

    var userObj = {
        "name": req.body.name,
        "mobile": req.body.mobile,
        "email": req.body.email,
        "otp_verified": "0",
        "otp": "1234",
        "password": req.body.password,
        "user_type": req.body.user_type, //volunteer,consumer
        "profile_photo": req.body.profile_photo
    }

    req.db.collection('users').insert(userObj, function(err, result) {
      if(err) {
                response = {"error" : true, "message" : result,"user_id":''};
                res.json(response);
            } else {
                let _user_id = result["ops"][0]["_id"];
                response = {"error" : false, "message" : "SUCCESS","user_id":_user_id};
                res.json(response);
            }
    })

})

app.post("/api/updateUserDetails", function(req, res) {

    console.log(req.body.user);

    var userDetailsObj = {
      "_id": req.body._id,
      "user_id": req.body.user_id,
      "address": req.body.address,
      "area": req.body.area,
      "pin": req.body.pin,
      "dob": req.body.dob,
      "age": req.body.age,
      "phone1": req.body.phone1,
      "phone2": req.body.phone2,
      "phone3": req.body.phone3,
      "id_proof_type": req.body.id_proof_type,
      "id_proof": req.body.id_proof,
      "reference1": req.body.reference1,
      "reference2": req.body.reference2,
      "family_member_no1": req.body.family_member_no1,
      "family_member_no2": req.body.family_member_no2    
    }

    req.db.collection('user_details').update({_id:req.body._id}, userDetailsObj, { upsert: true },function(err, result) {
      if(err) {
                response = {"error" : true, "message" : result};
                res.json(response);
            } else {
                let _user_id = result["ops"][0]["_id"];
                response = {"error" : false, "message" : "SUCCESS"};
                res.json(response);
            }
    })

})

app.post("/api/login", function(req, res) {

  // new code should come over here
  req.db.collection('users').findOne({mobile: req.body.mobile}, function(err, result){
    if(err) {
      response = {"error" : true, "message" : err};
      res.json(response);
    }
    else if(result){

      if (req.body.password != result.password){
        response = {"error" : true, "message" : "Password entered is invalid"};
        res.json(response);
            //console.log('Invalid Password');
          }else{
            console.log(result);
            let token = '';
            // let token = jwt.sign({username: req.body.mobile},
            //   config.secret,
            //   { expiresIn: '1h' // expires in 24 hours
            // }
            // );
            response = {"error" : false, "message" : "SUCCESS","user_detailes":result,"token": token};
            res.json(response);
            console.log('success');
          }  

        }
        else {
          response = {"error" : true, "message" : "Mobile Number entered is not registered with BeingWithYou"};
          res.json(response);
        //console.log('Invalid User ID');
      }
    });


})


app.use(Express.static(__dirname + '/Images'));

app.listen(process.env.PORT || 8080, function () {
  console.log('Example app listening on port ' + process.env.PORT);
});



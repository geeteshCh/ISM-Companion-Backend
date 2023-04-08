//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
//const dotenv = require("dotenv")

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors())

dbName = 'ismDB';
mongoose.connect("mongodb+srv://geeteshCh:chr0nometer@giantbear.zhoxbpj.mongodb.net/"+dbName);

// Member Schema
const memberSchema = new mongoose.Schema({
  email : 
  {
    type : String,
    required : true
  },
  name : String,
  clubIds: [String]
});
const  User = mongoose.model("User",memberSchema); // admin 

// Club Schema 
const clubSchema=new mongoose.Schema({

  name: {
      type: String,
      required: true,
      unique: true
  },
  tagline: {
      type: String
  },
  description: String,
  imgUrl: String,
  coordinates : String,
  links : {
      official : String,
      instagram : String,
      facebook : String,
      youtube : String 
  },
  office : String,
  inductionStatus: Boolean,
  inductionProcess: [{
    stepTitle: String,
    stepDescription: String,
    date: Date,
    time: String
  }],
  members: [{
      name : String,
      designation : String,
      contact : String,
      memURL: String
  }]

});
const Club = mongoose.model("club",clubSchema); // club

//CLUB ROUTES ---------------------------------------------------------------------------------------------------------

// get all club details  
app.get("/getClubs", (req,res)=>
{
 Club.find().select(['name','tagline','imgUrl'])
 .then((clubs)=>{
  res.status(200).send(clubs)
 })
 .catch((err)=>{
  console.log(err)
  res.status(500).send('Server Error')
 })  
})


// get Club Details by id
app.get("/getClubDetails/:id",(req,res)=>{
  const {id} = req.params;
  
    Club.find({_id:id})
    .then((clubs)=>{
      let clubsJson = clubs[0].toJSON()
      for (let i=0; i<clubsJson.inductionProcess.length; i++) {
        clubsJson.inductionProcess[i].date = clubs[0].inductionProcess[i].date.toISOString().slice(0,10);
      }
      res.status(200).send(clubsJson);
     })  
     .catch((err)=>{
    console.log(err);
    res.status(500).send('server error')
     })
})


// handle post request to add a new club
app.post("/addClub",function(req,res)
{
    const  clubName=req.body.name;
    const newEmail=req.body.email;
    newClub = new Club({
      name : clubName
    })
    newClub.save();
    
    User.find({email : newEmail}).then((foundUser) =>{

       if(foundUser.length == 0)
        {
          const clubsArr = [];
          clubsArr.push(newClub._id)
            const newUser=new User({
                email : newEmail,
                clubIds: clubsArr
            })
            newUser.save();
            res.status(200).send('new user and club created')
        }else{
          const clubsArr = foundUser[0].clubIds;
          clubsArr.push(newClub._id)
          User.updateOne({_id: foundUser[0]._id},{clubIds: clubsArr})
          .then(()=>{
          res.status(200).send('user updated and club created')
          })
          .catch((err)=>{
            console.log(err);
            res.status(500).send('server error')
          })
        }

    })
    .catch((err)=>{
      console.log(err)
      res.status(500).send()
       })
  })

  // Edit Club Details 
  app.put("/editClubDetails/:id",(req,res)=>{
    //const {id} = req.params;
    data = req.body;
    //console.log(data)
  console.log(req.body.name)
    Club.replaceOne({_id:data._id},req.body)
    .then((response)=>{
      console.log(response);
      res.status(200).send({msg:"ok"})
    })
    .catch((err)=>{
     console.log(err)
     res.status(500).json({msg:"server error"})
    })
  })



// EVENTS -----------------------------------------------------------------------------------------------------

// Event Schema
const eventSchema=new mongoose.Schema({

  name: {
      type: String,
      required: true,
      unique: true
  },
  tagline : String,
  description: String,
  club : String,
  date : Date,
  time : String,
  venue : String ,
  coordinates : String,
  eligibility : String,
  team : [{
      name : String,
      designation : String,
      email : String,
      contact : String,
      imgUrl : String
  }],
  registeredMembers: [{
    name : String,
    email : String 
  }]

});
const Event = mongoose.model("Event",eventSchema); // Event Collection

// get All Events 
app.get("/getEvents", (req,res)=>
{
  Event.find().select(['name','tagline','venue','coordinates','date','time','club'])
 .then((eventts)=>{
  let eventsJson = [];
  for(let i=0;i<eventts.length;i++){
    eventsJson.push(eventts[i].toJSON())
  }
  for(let i=0;i<eventsJson.length;i++){
    eventsJson[i].date = eventts[i].date.toISOString().slice(0,10);
  }
  res.status(200).send(eventsJson)
 })
 .catch((err)=>{
  console.log(err)
  res.status(500).send('server error while retrieving events')
})
})

// get Club Details by id
app.get("/getEventDetails/:id",(req,res)=>{
  const {id} = req.params; 
    Event.find({_id:id})
    .then((event)=>{
      let eventJson = event[0].toJSON();
      eventJson.date = event[0].date.toISOString().slice(0,10);
      res.status(200).send(eventJson)
     })  
     .catch((err)=>{
    console.log(err)
    res.status(500).send('server error while retreiving event details')
     })
    
})

// Post Requests to add a new event
app.post('/addEvent',(req,res)=>{
  Event.insertMany([req.body])
  .then(()=>{
    res.status(200).send('event added sucessfully');
  })
  .catch((err)=>{
    console.log(err);
    res.status(500).send('Error while adding an event');
  })
})

// Requests to edit Event Details 
app.put('/editEvent/:id',(req,res)=>{
  data = req.body;
  console.log(req.body.name)
  Event.replaceOne({_id:data._id},req.body)
  .then((response)=>{
    console.log(response);
    res.status(200).send({msg:"ok"})
  })
  .catch((err)=>{
   console.log(err)
   res.status(500).json({msg:"server error while editing event"})
  })
})

// To get Events for a particular Club 
app.get("/getClubEvents/:id", (req,res)=>
{
  const id=req.params.id;
  Event.find({club : id}).select(['name','tagline','date','time','club'])
 .then((eventts)=>{
  let eventsJson = [];
  for(let i=0;i<eventts.length;i++){
    eventsJson.push(eventts[i].toJSON())
  }
  for(let i=0;i<eventsJson.length;i++){
    eventsJson[i].date = eventts[i].date.toISOString().slice(0,10);
  }
  res.status(200).send(eventsJson)
 })
 .catch((err)=>{
  console.log(err)
  res.status(500).send('server error while retrieving Club events')
})
})



port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});
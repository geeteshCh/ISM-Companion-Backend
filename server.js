//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

dbName = 'ismDB';

mongoose.connect("mongodb://localhost:27017/" + dbName);

const clubSchema=new mongoose.Schema({

  name: {
      type: String,
      required: true,
      unique: true
  },
  tagline: {
      type: String
  },
  imgUrl: String,
  coordinates : String,
  links : {
      official : String,
      instagram : String,
      facebook : String,
      youtube : String 
  },
  office : String,
  members: [{
      name : String,
      designation : String,
      contact : String
  }]

});

const Club = mongoose.model("club",clubSchema); // club

artfreaks = new Club({
  name: 'Art Freaks',
  tagline: 'The club for all artists',
  imgUrl: 'kk'

});

roboism = new Club({
  name: 'Robo Ism',
  tagline: 'The robotics club ISM',
  imgUrl: 'kko'

});

//artfreaks.save();
//roboism.save();

app.get("/getClubs", (req,res)=>
{
 Club.find().select(['name','tagline','imgURL'])
 .then((clubs)=>{
  res.send(clubs)
 })
 .catch((err)=>{
  console.log(err)
 })

  
})

app.get("/getClubDetails/:id",(req,res)=>{
  let {id} = req.params;
  
    Club.find({_id:id})
    .then((clubs)=>{
      res.send(clubs[0])
     })  
     .catch((err)=>{
    console.log(err)
     })
})



port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});


//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//const dotenv = require("dotenv")
const app = express();
const cors = require("cors");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors({origin: "*"}))

dbName = 'ismDB';


//mongoose.connect("mongodb://localhost:27017/" + dbName);

//mongoose.connect(`mongodb+srv://${process.env.MONGODB_ATLAS_USERNAME}:${process.env.MONGODB_ATLAS_PASSWORD}@giantbear.zhoxbpj.mongodb.net/`+dbName)
// mongoose.connect(process.env.MONGODB_ATLAS_URL+dbName);
mongoose.connect("mongodb+srv://geeteshCh:chr0nometer@giantbear.zhoxbpj.mongodb.net/"+dbName);

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
      contact : String
  }]

});

const Club = mongoose.model("club",clubSchema); // club

// artfreaks = new Club({
//   name: 'Art Freaks',
//   tagline: 'The club for all artists',
//   imgUrl: 'kk'

// });

// roboism = new Club({
//   name: 'Robo Ism',
//   tagline: 'The robotics club ISM',
//   imgUrl: 'kko'

// });

// swimming = new Club({
//   name: 'Swimming Club',
//   tagline: 'Self Explanatory lol',
//   description: `Blue Lagoon SWIM 'N' GYM serves the greater Dhanbad, JH. Their pool is always clean and well-maintained. Their trainers behave friendly with their swimmers. Blue Lagoon SWIM 'N' GYM is a nice place for relaxing swim and is also great for learning professional swimming. Their trainers always give professional training to their swimmers at affordable prices. They clean the pool water regularly. Their pool is also an excellent place for beginners who want to learn to swim. Blue Lagoon SWIM 'N' GYM also offer Yoga, Gymnasium to their customers.`,
//   imgUrl: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FSwimming&psig=AOvVaw0ViiHLq4LoYEgWcWHO1fi2&ust=1681000872532000&source=images&cd=vfe&ved=0CBEQjRxqFwoTCMDHtrGGmf4CFQAAAAAdAAAAABAE',
//   coordinates: '12.46.0.98.3',
//   links: {
//     facebook: 'https://www.facebook.com',
//     instagram: 'https://www.instagram.com'
//   },
//   inductionStatus: true,
//   inductionProcess: [{stepTitle:'long swim',stepDescription:'should swim 200m freestyle',date:'2023-04-09',time:'6:00 PM'}, {stepTitle:'butterfly',stepDescription:'should swim 100m butterfly',date:'2023-04-10',time:'7:00 PM'}],
//   office: 'Swimming Pool, SAC',
//   members: [{name:'Priyatam', designation:'pool cleaner', contact:'9277817236'},{name:'Geetesh', designation:'member', contact:'9347817236'}]

// });

//artfreaks.save();
//roboism.save();
//swimming.save()
//console.log('Document added sucesfully')

app.get("/getClubs", (req,res)=>
{
 Club.find().select(['name','tagline','imgUrl'])
 .then((clubs)=>{
  res.send(clubs)
 })
 .catch((err)=>{
  console.log(err)
 })

  
})

app.get("/getClubDetails/:id",(req,res)=>{
  const {id} = req.params;
  
    Club.find({_id:id})
    .then((clubs)=>{
      res.send(clubs[0])
     })  
     .catch((err)=>{
    console.log(err)
     })
})

// app.put("/editClubDetails/:id",(req,res)=>{
//   //const {id} = req.params;
//   data = req.body;
//   console.log(data)
// })


port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});


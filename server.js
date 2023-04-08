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

const memberSchema = new mongoose.Schema({
  email : 
  {
    type : String,
    required : true
  },
  name : String,
});
const  User = mongoose.model("User",memberSchema); // admin 

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

// artfreaks = new Club({
//   name: 'Art Freaks',
//   tagline: 'The club for all artists',
//   description: `Art is freedom. Being able to bend things most people see as a straight line.OUTSHINE provides everyone a common platform to showcase their artistic side and give wings to their creativity. So get ready to unleash your artistic vision and create an artwork that outshines others.`,
//   imgUrl: 'https://pbs.twimg.com/media/E6m7GZgXsAMQFxa?format=jpg&name=large',
//   coordinates: '12.46.0.98.3',
//   links: {
//       facebook: 'https://www.facebook.com',
//       instagram: 'https://www.instagram.com/explore/tags/artfreak/'
//   },
//   inductionStatus: false,
//   inductionProcess: [{stepTitle:'passionate artist',stepDescription:'Should Provide 3 best arts',date:'2023-04-09',time:'6:00 PM'}],
//   office: 'SAC, Room No:107',
//   members: [{name:'Vishwa', designation:'coordinator', contact:'9277817236'},{name:'Geetesh', designation:'member', contact:'9347817236'}]
  
// });

// roboism = new Club({
//   name: 'Robo Ism',
//   tagline: 'The robotics club ISM',
//   description: `Robotics & AI Club is a student-run organization/club of Indian Institute of Technology (ISM) Dhanbad. The Robotics Club is a community of students who derive pleasure in creating mechanical peers that may even be potent to work without human intervention.`,
//   imgUrl: 'https://www.analyticsinsight.net/wp-content/uploads/2021/12/The-Future-of-Robotics-Its-Implications-in-2021-and-Beyond.jpg',
//   coordinates: '12.46.0.98.3',
//   links: {
//       facebook: 'https://www.facebook.com',
//       instagram: 'https://www.instagram.com/robo__ism/'
//   },
//   inductionStatus: false,
//   inductionProcess: [{stepTitle:'Individual project',stepDescription:'Participants are expected to design a hardware that solve some real world problem',date:'2023-04-09',time:'6:00 PM'}],
//   office: 'SAC, Room No:307',
//   members: [{name:'Vishwa', designation:'coordinator', contact:'9277817236'},{name:'Sandeep', designation:'member', contact:'9346914615'}]
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

// get all club details  
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


// get Club Details by id
app.get("/getClubDetails/:id",(req,res)=>{
  const {id} = req.params;
  
    Club.find({_id:id})
    .then((clubs)=>{
      let clubsJson = clubs[0].toJSON()
      for (let i=0; i<clubsJson.inductionProcess.length; i++) {
        clubsJson.inductionProcess[i].date = clubs[0].inductionProcess[i].date.toISOString().slice(0,10);
      }
      res.send(clubsJson);
     })  
     .catch((err)=>{
    console.log(err);
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
      console.log(foundUser);
       if(foundUser.length == 0)
        {
            const newUser=new User({
                email : newEmail,
            })
            newUser.save();
        }
    })
    .catch((err)=>{
      console.log(err)
       })
  })

  // Edit Club Details 
  app.put("/editClubDetails/:id",(req,res)=>{
    //const {id} = req.params;
    data = req.body;
    //console.log(data)
  
  
  console.log(req.body.name)
    Club.replaceOne({_id:data._id},req.body)
    .catch((err)=>{
     console.log(err)
    })
  })

port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});


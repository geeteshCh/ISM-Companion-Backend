//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//const dotenv = require("dotenv")
const app = express();
const cors = require("cors");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors())

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
  clubIds: [String]
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
        // clubsJson.inductionProcess[i].date =clubs[0].inductionProcess[i].date.toISOString().slice(0,4)+ '/'+clubs[0].inductionProcess[i].date.toISOString().slice(5,7)+'/'+clubs[0].inductionProcess[i].date.toISOString().slice(8,10);

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

// Takshak = new Event({
//     name: 'Takshak',
//     tagline: 'From Thoughts To Reality',
//     description: `From thought to reality... TAKSHAK is a Sanskrit name taken from Hindu Mythology which carries a meaning associated with managing, creating, or maintaining anything.It hence is a fitting name for a robotics fest as all these aspects along with its interdisciplinary nature are what make Robotics one of the most challenging fields of study. TAKSHAK is East India's largest robotics fest organized by Robotronics - The Robotics and Al Club of IIT ISM Dhanbad.`,
//     coordinates: '12.46.0.98.420',
//     club : "64310fcc473b537b4928f28a",
//     date : "2023-04-08",
//     time : "06:00PM",
//     venue : "SAC 1rd Floor",
//     eligibility : "Must be an Undergrad",
//     team: [{name:'Vishwa', designation:'coordinator', email:'manisandeept7@gmail.com',contact : '1234567890',imgUrl: 'https://www.analyticsinsight.net/wp-content/uploads/2021/12/The-Future-of-Robotics-Its-Implications-in-2021-and-Beyond.jpg'},{name:'Geetesh', designation:'member', contact:'9347817236',email :'geetesh@gmail.com',imgUrl : 'https://www.analyticsinsight.net/wp-content/uploads/2021/12/The-Future-of-Robotics-Its-Implications-in-2021-and-Beyond.jpg'}],
//     registeredMembers : [{name : "Mani Sandeep",email : "tmsandy07@gmail.com"}]
//   });
//Takshak.save();
  
// Swimming = new Event({
//   name: 'swimming Race',
//   tagline: 'Live to swim.',
//   description: `swimming, in recreation and sports, the propulsion of the body through water by combined arm and leg motions and the natural flotation of the body. Swimming as an exercise is popular as an all-around body developer and is particularly useful in therapy and as exercise for physically handicapped persons.`,
//   coordinates: '12.46.0.97.430',
//   club : "64310f89676038ccc6f28512",
//   date : "2023-04-01",
//   time : "02:00PM",
//   venue : "SAC Swimming Pool",
//   eligibility : "Must be an Undergrad",
//   team: [{name:'Mani Sandeep', designation:'coordinator', email:'manisandeept7@gmail.com',contact : '1234567890',imgUrl: 'https://www.analyticsinsight.net/wp-content/uploads/2021/12/The-Future-of-Robotics-Its-Implications-in-2021-and-Beyond.jpg'},{name:'Geetesh', designation:'member', contact:'9347817236',email :'geetesh@gmail.com',imgUrl : 'https://www.analyticsinsight.net/wp-content/uploads/2021/12/The-Future-of-Robotics-Its-Implications-in-2021-and-Beyond.jpg'}],
//   registeredMembers : [{name : "Priyatam",email : "priyatam@gmail.com"}]
// });
// Swimming.save();


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

// app.post('/addEvent',(req,res)=>{
//   Event.
// })

app.get("/getClubEvents/:id", (req,res)=>
{
  const id=req.params.id;
  Event.find({club : id}).select(['name','tagline','date','time','club'])
 .then((eventts)=>{
  // let eventsJson = eventTs.toJSON();
  // for(i=0;i<eventsJson.length;i++){
  //   eventsJson[i].date = eventTs[i].date.toISOString().slice(0,10);
  // }
  res.status(200).send(eventts)
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
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

dbName = 'ismDB'
mongoose.connect("mongodb+srv://geeteshCh:chr0nometer@giantbear.zhoxbpj.mongodb.net/"+dbName);

const candidateSchema = new mongoose.Schema({
    name: String,
    imgURL: String
});
const Candidate = mongoose.model("candidates",candidateSchema); 

app.get('/sg',(req,res)=>{
    Candidate.find()
    .then((candidates)=>{
        res.send(candidates)
    })
    
})

let flag = true;
let isStarted = false;

function startVotingProcess(){
    
    Candidate.find()
    .then((candidates)=>{
        console.log(candidates)
    })
    isStarted = true
}

function stopVotingProcess(){
    
}
if (flag == true && isStarted == false){
    startVotingProcess();
}

if (flag == false && isStarted == true){
    stopVotingProcess();
}





port = process.env.PORT || 3030;
app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});
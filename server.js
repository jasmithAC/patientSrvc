const express = require('express');
const path=require('path');
const moongoose=require("mongoose");
const bodyParser = require("body-parser");

const { json, response } = require('express');
const { nextTick } = require('process');
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const { brotliDecompress } = require('zlib');

const Patient=require('./src/patientModel.js');
const Subpopulation=require('./src/subpopulationModel.js');
const CaseLoad=require('./src/caseloadModel.js');

const app = express();
const PORT=process.env.PORT ||5001;

//var jsonParser=bodyParser.json();

const config={
    authRequired: false,
    auth0Logout: true,
    secret:'db615577d9efc97b5ab424e7cdc7430e2c3647fe897cd980dc0f27ca2fa073f3',
    baseURL:'http://localhost:5000',
    clientID: 'nz6kUR2kiIxFvF55ntPlQvqueg5FHtE3',
    issuerBaseURL: 'https://dev-8m7lp7gpu0lsfpiy.us.auth0.com'
};

moongoose.connect("mongodb://localhost:27017/plookoon");


//================================= App Configuration Goodness =================================

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/html')));
app.listen(PORT,()=>console.log(`listening on port ${PORT}`));
app.use(express.json());
app.use(auth(config));
app.use(bodyParser.json()); //to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended:true})); //to support URL-encoded bodies

//================================= The Party Starts Here =================================

// may tease these out into the patientModel.js file later
//looking a two differen patterns to implement async mongoose - avoid promise chains
async function findPatients(req,res,jsonSearch){
    Patient.model.find(jsonSearch, async function(err,patients){
        if (err){
            res.send('something went wrong');
            next();
        }
        if (patients){
            return res.send(patients);
        } 
    });
}

async function updatePatient(req,res,jsonSearch){
    try{
        const patientRecord=await Patient.model.findOne(jsonSearch)
        Object.assign(patientRecord,req.body);
        await patientRecord.save()
    }catch(e){
        console.log(e.message);
    }

}





app.get('/patient/:id',function(req,res){
    findPatients(req,res,{grpId:req.params.id});
})

app.get('/patients/find',function(req,res){
    findPatients(req,res,req.body);
})


app.post('/patient',function(req,res){
    let patient= new Patient.model(req.body)
    patient.save();
    res.json({stub_data:patient});
})

app.put('/patient/:id',function(req,res){
   updatePatient(req,res,{grpId:parseInt(req.params.id)})
})

//====================================

async function findSubpopulationPatients(req,res,ObjectId){
    
    try{
        const subpop=await Subpopulation.model.findById(ObjectId);
        let cstring=JSON.parse(JSON.stringify(subpop.dimensions));
        const constituent_patients= await Patient.model.find(cstring);
        //res.json({data:constituent_patients,count:constituent_patients.length}) 
        return constituent_patients
    }catch(e){
        console.log("There's been an exception");
        console.log(e.message);
    }
}

async function getSubPopulationPatients(req,res,ObjectId){
    try{
        let results=await findSubpopulationPatients(res,res,ObjectId);
        res.json({data:results,count:results.length})
    }catch(e){
        console.log(e.message);
    }
}

async function getSubPopulationPatientsCount(req,res,ObjectId){
    try{
        let results=await findSubpopulationPatients(res,res,ObjectId);
        res.json({count:results.length})
    }catch(e){
        console.log(e.message);
    }
}


// Subpopulaiton - logical groupings of patients - dynamically maintained
app.get('/subpopulations',function(req,res){
    res.json({stub_data:"An array of all subpopulation objects - !include patients"})
})

app.get('/subpopulation/:id',function(req,res){
    res.json({stub_data:"returns single subpopulaiton object - !include patients"})
})

app.get('/subpopulation/:id/patients',function(req,res){
    getSubPopulationPatients(req,res,req.params.id)
})

app.get('/subpopulation/:id/patients/count',function(req,res){
    getSubPopulationPatientsCount(req,res,req.params.id)
})

app.post('/subpopulation',function(req,res){
    let subpop=new Subpopulation.model(req.body);
    subpop.save();
    res.json({data:subpop});
})


//Case Loads

app.post('/caseload',function(req,res){


})

app.get('/caseload/:id',function(req,res){

});




const moongoose=require("mongoose");

const patientSchema={
    last_name:String,
    first_name:String,
    insurance: String,
    insurance_number:String,
    phone_number:String,
    email:String,
    age: Number,
    dob: Date,
    address: String,
    city:String,
    state:String,
    zipCode:String,
    grpId:Number
}

const Patient=moongoose.model("Patient",patientSchema);

exports.model=Patient;
const moongoose=require("mongoose");

const caseloadSchema={
    name:String,
    description:String,
    owner:String, //will be replaced with employee object
    members:[],
    grpId:Number
}

const CaseLoad=moongoose.model("CaseLoad",caseloadSchema);

exports.model=CaseLoad;
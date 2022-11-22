const moongoose=require("mongoose");

const subpopulationSchema={
    name:String,
    description:String,
    owner:String,
    dimensions:{},
    createdAt:Date,
    updates:[Date]
}

const Subpopulation=moongoose.model("Subpopulation",subpopulationSchema);

exports.model=Subpopulation;
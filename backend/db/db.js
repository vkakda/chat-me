import mongoose from "mongoose";

console.log(process.env.MONGO_URI);

function connect(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("MongoDb connected");
    }).catch((err)=>{
        console.log("Database connection failed");
        console.log(err);
    });
}

export default connect;
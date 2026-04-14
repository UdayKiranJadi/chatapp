import mongoose from "mongoose";

export const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if(!uri) throw new Error("MONGO_URI is not Available");
    

     try {
        await mongoose.connect(uri, {dbName: "chatapp"})
        console.log("DB connected Succefully");
        
     } 
     
     catch (error) {
        console.log("MongoDB connection Error", error);
        process.exit(1);
     }
}
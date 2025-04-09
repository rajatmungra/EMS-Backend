import mongoose from "mongoose";

export const connectToDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('Connnected to DB')
    }
    catch(error){
        console.log(error)
    }
}

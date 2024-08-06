import mongoose, { Schema } from "mongoose";
import validator from "validator";


interface UserInterface extends Document { // Document is a type of mongoose which is used to define the type of data
    _id: string;
    name: string;
    email: string;
    photo: string;
    role: "admin" | "user";
    gender: "male" | "female";
    dob: Date;
    createdAt: Date;
    updatedAt: Date;
    // virtual field
    age: number;
}

const userSchema = new Schema({
    _id:{
        type: String,
        required: [true, "Please enter ID"],
    },
    name:{
        type: String,
        required: [true, "Please enter Name"],
    },
    email:{
        type: String,
        required: [true, "Please enter Email"],
        unique: true,
        validate: [validator.default.isEmail, "Please enter valid Email"],
    },
    photo:{
        type: String,
        required: [true, "Please add Photo"],
    },
    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    gender:{
        type: String,
        enum: ["male", "female"], // enum means only these values are allowed
        required: [true, "Please enter Gender"]
    },
    dob:{
        type: Date,
        required: [true, "Please enter Date of Birth"]
    }
},{timestamps:true});

userSchema.virtual("age").get(function(){
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear(); // 2021 - 1998 = 23

    if( // if birthday has not come yet this year then age will be 1 less than calculated
        today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
    ){
        age--;
    } 
    return age;
});

export const User = mongoose.model<UserInterface>("User", userSchema);

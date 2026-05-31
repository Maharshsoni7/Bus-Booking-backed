import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    google_id: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profile_pic: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },

}); 
const User = mongoose.model("User", userSchema);
export default User;
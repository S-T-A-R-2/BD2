import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
    {
        name : {type: String, trim: ture}
    }
);

export default mongoose.model("User", UserSchema);

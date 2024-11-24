import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is require'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'email is mandatory'],
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    password: {
        type: String,
        required: [true, 'Password is mandatory'],
        minLength: [6, 'password must be in between 6 to 14 characters'],
        maxLength: [14, 'password must be in between 6 to 14 characters'],
    },
    cartItems: [
        {
            quantity: {
                type: Number,
                default: 1
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
        }
    ],
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User'
    }

},{
    timestamps: true  // CreatedAt and UpdatedAt
})

//Pre-save hook to hash password before saving to the database
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()

    try {
        const salt = await bcrypt.genSalt(12)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})

//Compare the provided password with the stored password in the database
// Add comparePassword method to userSchema
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };


const User = mongoose.model('User', userSchema)
export default User
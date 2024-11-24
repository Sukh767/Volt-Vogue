import mongoose, { Schema } from "mongoose";
import bycrpt from 'bcryptjs'

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
        enum: ['customer', 'admin'],
        default: 'customer'
    }

},{
    timestamps: true  // CreatedAt and UpdatedAt
})

//Pre-save hook to hash password before saving to the database
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()

    try {
        const salt = await bycrpt.genSalt(12)
        this.password = await bycrpt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})

//Compare the provided password with the stored password in the database
//Compare the two passwords using bcrypt
userSchema.method.comparePassword = async function(password){
    return await bycrpt.compare(password, this.password)
}


const User = mongoose.model('User', userSchema)
export default User
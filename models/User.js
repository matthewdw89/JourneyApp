const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a new Schema that describes what key-value pairs each kitten document has
const userSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true
    },
    nationality: {
        type: String
    },
    email: {
        type: String,
        required:true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    bio: {
        type: String
    },
    interests: [String],
    next_destination: {
        type: String
    },
    img_url: {
        type: String,
        default: "https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg"
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    date_created: {
        type: Date,
        required: true,
        default: new Date()
    }
})

userSchema.index({ location: '2dsphere'});
module.exports = mongoose.model('User', userSchema)
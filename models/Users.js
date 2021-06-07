const { Schema, model } = require('mongoose')


var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}
const UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: 'Username is Required',
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: 'Email address is required',
            validate: [validateEmail, 'Please fill a valid email address'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

        }
    }
)

const User = model('User', UserSchema)

module.exports = User
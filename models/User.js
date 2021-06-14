const { Schema, model } = require('mongoose')


var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
}
const UserSchema = new Schema(
    {
        usrname: {
            type: String,
            unique: true,
            required: 'Username is needed',
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            required: 'Email address is needed',
            validate: [validateEmail, 'Please submit a valid email address'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please submit a valid email address']

        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true 
        },
        id: false
    })

UserSchema.virtual('friendsCnt').get(function() {
    return this.friends.length
})

const User = model('User', UserSchema)

module.exports = User
const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat')

const reactionSchema = new Schema({
    usrname: {
        type: String,
        required: true
    },
    reactId: {
        type: Types.ObjectId,
        default: new Types.ObjectId()
    },
    reactBody: {
        type: String,
        required: true,
        maxLength: 280
    },

    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtVal) => dateFormat(createdAtVal)
    }
},
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    });

module.exports = reactionSchema;
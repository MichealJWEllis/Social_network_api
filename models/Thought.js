const { Schema, model } = require('mongoose')
const dateFormat = require('../utils/dateFormat')
const reactSchema = require('./Reactions')

const thoughtSchema = new Schema(
    {
        usrname: {
            type: String,
            required: true
        },
        thoughtInfo: {
            type: String,
            required: true,
            min: 1,
            max: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dateFormat(createdAtVal)
        },
        
        reactions: [reactSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
)

thoughtSchema.virtual('reactCnt').get(function() {
    return this.reactions.length
})

const Thought = model('Thought', thoughtSchema)

module.exports = Thought; 
const { User, Thought, Reaction } = require('../models')

const thoughtController = {
    // GET /api/thoughts
    getAllThoughts(req, res) {
        Thought.find({})
            .populate({ path: 'reactions', select: '-__v' })
            .select('-__v')
            .then(dbThoughtInfo => res.json(dbThoughtInfo))
            .catch(e => {
                console.log(e);
                res.status(500).json(e);
            })
    },
    // GET /api/thoughts/:id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
            .populate({ path: 'reactions', select: '-__v' })
            .select('-__v')
            .then(dbThoughtInfo => {
                if (!dbThoughtInfo) {
                    res.status(404).json({ message: 'No thought found at this id' });
                    return;
                }
                res.json(dbThoughtInfo);
            })
            .catch(e => {
                console.log(e);
                res.status(400).json(e);
            });
    },
    // POST /api/thoughts
    createThought({ body }, res) {
        Thought.create(body)
            .then(dbThoughtInfo => {
                User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: dbThoughtInfo._id } },
                    { new: true }
                )
                    .then(dbUserInfo => {
                        if (!dbUserInfo) {
                            res.status(404).json({ message: 'No user found at this id' });
                            return;
                        }
                        res.json(dbUserInfo);
                    })
                    .catch(e => res.json(e));
            })
            .catch(e => res.status(400).json(e));
    },
    // POST /api/thoughts/:id/reactions
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbThoughtInfo => {
                if (!dbThoughtInfo) {
                    res.status(404).json({ message: 'No thought found at this id' });
                    return;
                }
                res.json(dbThoughtInfo);
            })
            .catch(e => res.status(500).json(e));
    },
    // PUT /api/thoughts/:id
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true }
        )
            .then(dbThoughtInfo => {
                if (!dbThoughtInfo) {
                    res.status(404).json({ message: 'No thought found at this id' });
                    return;
                }
                res.json(dbThoughtInfo);
            })
            .catch(e => res.status(400).json(e));
    },
    // DELETE /api/thoughts/:id
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
            .then(dbThoughtInfo => {
                if (!dbThoughtInfo) {
                    res.status(404).json({ message: 'No thought found at this id' });
                    return;
                }
                User.findOneAndUpdate(
                    { username: dbThoughtInfo.username },
                    { $pull: { thoughts: params.id } }
                )
                    .then(() => {
                        res.json({ message: 'Successfully deleted thought' });
                    })
                    .catch(e => res.status(500).json(e));
            })
            .catch(e => res.status(500).json(e));
    },

    // DELETE /api/thoughts/:id/reactions
    deleteReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: body.reactionId } } },
            { new: true, runValidators: true }
        )
            .then(dbThoughtInfo => {
                if (!dbThoughtInfo) {
                    res.status(404).json({ message: 'No thought found at this id' });
                    return;
                }
                res.json({ message: 'Successfully deleted reaction' });
            })
            .catch(e => res.status(500).json(e));
    },
}
module.exports = thoughtController;


// expected bodies: 

// POST /api/thoughts
//{
//     "thoughtInfo": "",
//     "usrname": "",  
//     "userId": ""  
// }

// PUT /api/thoughts/:id
// expected body should include at least one of the following attributes:
// {
//     "thoughtInfo": "",
//     "usrname": "",  
//     "userId": ""  
// }

// DELETE /api/thoughts/:id/reactions
// expected body should include at least one of the following attributes:
// {
//     "reactionId": ""  
// }
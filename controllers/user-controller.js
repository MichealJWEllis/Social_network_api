const { User, Thought } = require('../models');

const userController = {
    // GET /api/users
    getAllUsers(req, res) {
        User.find({})
        .select('-__v')
        .then(dbUserInfo => res.json(dbUserInfo))
        .catch(e => {
            console.log(e);
            res.status(500).json(e);
        })
    },
    // GET /api/users/:id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate([
            { path: 'thoughts', select: "-__v" },
            { path: 'friends', select: "-__v" }
        ])
        .select('-__v')
        .then(dbUserInfo => {
            if (!dbUserInfo) {
                res.status(404).json({message: 'No user found at this id'});
                return;
            }
            res.json(dbUserInfo);
        })
        .catch(e => {
            console.log(e);
            res.status(400).json(e);
        });
    },
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserInfo => res.json(dbUserInfo))
        .catch(e => res.status(400).json(e));
    },
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserInfo => {
            if (!dbUserInfo) {
                res.status(404).json({ message: 'No user found at this id' });
                return;
            }
            res.json(dbUserInfo);
        })
        .catch(e => res.status(400).json(e));
    },    
    // POST /api/users/:userId/friends/:friendId
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbUserInfo => {
            if (!dbUserInfo) {
                res.status(404).json({ message: 'No user found at this userId' });
                return;
            }
            User.findOneAndUpdate(
                { _id: params.friendId },
                { $addToSet: { friends: params.userId } },
                { new: true, runValidators: true }
            )
            .then(dbUserInfoBeta => {
                if(!dbUserInfoBeta) {
                    res.status(404).json({ message: 'No user found at this friendId' })
                    return;
                }
                res.json(dbUserInfo);
            })
            .catch(e => res.json(e));
        })
        .catch(e => res.json(e));
    },
    // DELETE /api/users/:id
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserInfo => {
            if (!dbUserInfo) {
                res.status(404).json({ message: 'No user found at this id'});
                return;
            }
            User.updateMany(
                { _id : {$in: dbUserInfo.friends } },
                { $pull: { friends: params.id } }
            )
            .then(() => {
                Thought.deleteMany({ username : dbUserInfo.username })
                .then(() => {
                    res.json({message: "Successfully deleted user"});
                })
                .catch(e => res.status(400).json(e));
            })
            .catch(e => res.status(400).json(e));
        })
        .catch(e => res.status(400).json(e));
    },
    // DELETE /api/users/:userId/friends/:friendId
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
        .then(dbUserInfo => {
            if (!dbUserInfo) {
                res.status(404).json({ message: 'No user found at this userId' });
                return;
            }
            User.findOneAndUpdate(
                { _id: params.friendId },
                { $pull: { friends: params.userId } },
                { new: true, runValidators: true }
            )
            .then(dbUserInfoBeta => {
                if(!dbUserInfoBeta) {
                    res.status(404).json({ message: 'No user found at this friendId' })
                    return;
                }
                res.json({message: 'Successfully deleted the friend'});
            })
            .catch(e => res.json(e));
        })
        .catch(e => res.json(e));
    }
}

module.exports = userController;


// expected bodies: 

// POST /api/users
// expected body:
// {
//     "username": "",
//     "email": "test@test.com"  // must follow the email format
// }

// PUT /api/users/:id
// expected body includes at least one of the attributes below:
// {
//     "username": "",
//     "email": "test@test.com"  // must follow the email format
// }
const router = require('express').Router();
const {
    getAllUsers,
    getUserById,
    crteUser,
    updUser,
    delUser,
    addFriend,
    delFriend
} = require('../../controllers/user-controller');

router
    .route('/')
    .get(getAllUsers)
    .post(crteUser);

router.route('/:id')
    .get(getUserById)
    .put(updUser)
    .delete(delUser)

router.route('/:userId/friends/:friendId')
    .post(addFriend)
    .delete(delFriend)

module.exports = router;
const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtById,
    crteThought,
    updThought,
    delThought,
    addReaction,
    delReaction
} = require('../../controllers/thought-controller');

router
    .route('/')
    .get(getAllThoughts)
    .post(crteThought);

router
    .route('/:id')
    .get(getThoughtById)
    .put(updThought)
    .delete(delThought);

router.route('/:thoughtId/reactions/')
    .post(addReaction)
    .delete(delReaction)

module.exports = router;
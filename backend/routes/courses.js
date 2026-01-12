const express = require('express');
const { list, create, update, remove } = require('../controllers/courseController');
const auth = require('../middleware/auth');

const router = express.Router();

// GET all courses
router.get('/', list);

// POST a new course
router.post('/', auth, create);

// UPDATE an existing course
router.put('/:id', auth, update);

// DELETE a course
router.delete('/:id', auth, remove);

module.exports = router;
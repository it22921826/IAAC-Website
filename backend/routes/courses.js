const express = require('express');
const { list, create, update, remove } = require('../controllers/courseController');

const router = express.Router();

// GET all courses
router.get('/', list);

// POST a new course
router.post('/', create);

// UPDATE an existing course
router.put('/:id', update);

// DELETE a course
router.delete('/:id', remove);

module.exports = router;
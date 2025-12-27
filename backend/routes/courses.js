const express = require('express');
// Import all 3 functions
const { list, create, remove } = require('../controllers/courseController');

const router = express.Router();

// GET all courses
router.get('/', list);

// POST a new course (This was missing!)
router.post('/', create);

// DELETE a course
router.delete('/:id', remove);

module.exports = router;
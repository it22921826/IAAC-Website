const express = require('express');
const { list, create, update, remove } = require('../controllers/trainingProgramController');
const auth = require('../middleware/auth');

const router = express.Router();

// GET all training programs
router.get('/', list);

// POST a new training program
router.post('/', auth, create);

// UPDATE a training program
router.put('/:id', auth, update);

// DELETE a training program
router.delete('/:id', auth, remove);

module.exports = router;

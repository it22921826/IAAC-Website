const express = require('express');
const { list, create, update, remove } = require('../controllers/eventController');

const router = express.Router();

// Public list
router.get('/', list);

// Admin dashboard create/update/delete (no auth here in current setup)
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;

const express = require('express');
const staffController = require('../controllers/staffController');

const router = express.Router();

router.get('/', staffController.list);
router.post('/', staffController.create);
router.put('/:id', staffController.update);
router.delete('/:id', staffController.remove);

module.exports = router;
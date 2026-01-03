const express = require('express');
const noticeController = require('../controllers/noticeController');

const router = express.Router();

router.get('/', noticeController.list);
router.post('/', noticeController.create);
router.put('/:id', noticeController.update);
router.delete('/:id', noticeController.remove);

module.exports = router;

'use strict';

var express = require('express');
var controller = require('./article.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);

module.exports = router;

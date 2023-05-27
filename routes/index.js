const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('/', (req, res, next) => { next(new DocumentNotFoundError('Page not found')); });

module.exports = router;

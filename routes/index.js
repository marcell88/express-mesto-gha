const router = require('express').Router();
const auth = require('../middlewares/auth');
const userRouter = require('./users');
const cardRouter = require('./cards');
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');
const { signupValidation, signinValidation } = require('../middlewares/preValidation');
const { login, createUser } = require('../controllers/users');

router.post('/signin', signinValidation, login);
router.post('/signup', signupValidation, createUser);
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('/', (req, res, next) => { next(new DocumentNotFoundError('Page not found')); });

module.exports = router;

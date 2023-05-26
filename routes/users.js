const userRouter = require('express').Router();
const userControllers = require('../controllers/users');

userRouter.get('/', userControllers.getUsers);
userRouter.post('/', userControllers.createUser);
userRouter.get('/:id', userControllers.getUserById);

userRouter.patch('/me', userControllers.updateProfile);
userRouter.patch('/me/avatar', userControllers.updateAvatar);

module.exports = userRouter;

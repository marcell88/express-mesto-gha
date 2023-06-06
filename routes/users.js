const userRouter = require('express').Router();
const userControllers = require('../controllers/users');
const { idParamValidation, userProfileValidation, userAvatarValidation } = require('../middlewares/preValidation');

userRouter.get('/', userControllers.getUsers);
userRouter.get('/me', userControllers.getCurrentUser);
userRouter.get('/:id', idParamValidation, userControllers.getUserById);
userRouter.patch('/me', userProfileValidation, userControllers.updateProfile);
userRouter.patch('/me/avatar', userAvatarValidation, userControllers.updateAvatar);

module.exports = userRouter;

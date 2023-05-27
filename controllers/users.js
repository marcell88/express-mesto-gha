const mongoose = require('mongoose');
const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('node:http2').constants;

const BadRequestError = require('../errors/BadRequestError');
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');
const UnhandledError = require('../errors/UnhandledErrod');
const User = require('../models/users');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch(() => {
      next(new UnhandledError('Server has broken while trying to get all users'));
    });
};

const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => { throw new mongoose.Error.DocumentNotFoundError(); })
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new DocumentNotFoundError('User with such id has not found'));
        return;
      }
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Please enter correct user id'));
        return;
      }
      next(new UnhandledError('Server has broken while trying to get user by id'));
    });
};

const createUser = (req, res, next) => {
  User.create(req.body)
    .then((user) => res.status(HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Incorrect data were send to server for user creation'));
        return;
      }
      next(new UnhandledError('Server has broken while trying to create new user'));
    });
};

const updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => { throw new mongoose.Error.DocumentNotFoundError(); })
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Incorrect data were send to server for profile update'));
        return;
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new DocumentNotFoundError('User with such id has not found'));
        return;
      }
      next(new UnhandledError('Server has broken while trying to update profile'));
    });
};

const updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => { throw new mongoose.Error.DocumentNotFoundError(); })
    .then((user) => res.status(HTTP_STATUS_OK).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Incorrect data were send to server for avatar update'));
        return;
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new DocumentNotFoundError('User with such id has not found'));
        return;
      }
      next(new UnhandledError('Server has broken while trying to update avatar'));
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};

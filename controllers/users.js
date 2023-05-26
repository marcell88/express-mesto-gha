const mongoose = require('mongoose');

const User = require('../models/users');

const BadRequestError = require('../errors/BadRequestError');
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');
const UnhandledError = require('../errors/UnhandledErrod');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      throw new UnhandledError('Server has broken while trying to get all users');
    })
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => { throw new mongoose.Error.DocumentNotFoundError(); })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        throw new DocumentNotFoundError('User with such id has not found');
      }
      if (err instanceof mongoose.Error.CastError) {
        throw new BadRequestError('Please enter correct user id');
      }
      throw new UnhandledError('Server has broken while trying to get user by id');
    })
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new BadRequestError('Incorrect data were send to server for user creation');
      }
      throw new UnhandledError('Server has broken while trying to create new user');
    })
    .catch((err) => next(err));
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
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new BadRequestError('Incorrect data were send to server for profile update');
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        throw new DocumentNotFoundError('User with such id has not found');
      }
      throw new UnhandledError('Server has broken while trying to update profile');
    })
    .catch((err) => next(err));
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
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new BadRequestError('Incorrect data were send to server for avatar update');
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        throw new DocumentNotFoundError('User with such id has not found');
      }
      throw new UnhandledError('Server has broken while trying to update avatar');
    })
    .catch((err) => next(err));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};

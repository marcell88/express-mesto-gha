const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = require('node:http2').constants;

const MONGO_DUBLICATE_ERROR = 11000;
const SUPER_SECRET = 'super-secret';

const BadRequestError = require('../errors/BadRequestError');
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');
const UnhandledError = require('../errors/UnhandledErrod');
const UnauthorizedError = require('../errors/UnautorizedError');
const ConflictError = require('../errors/ConflictError');
const User = require('../models/users');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch(() => {
      next(new UnhandledError('Server has broken while trying to get all users'));
    });
};

const findUserById = (id, req, res, next) => {
  User.findById(id)
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

const getUserById = (req, res, next) => {
  findUserById(req.params.id, req, res, next);
};

const getCurrentUser = (req, res, next) => {
  findUserById(req.user._id, req, res, next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(HTTP_STATUS_CREATED).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === MONGO_DUBLICATE_ERROR) {
        next(new ConflictError('User with such email is already registered'));
        return;
      }
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Incorrect data were send to server for user creation'));
        return;
      }
      next(new UnhandledError('Server has broken while trying to create new user'));
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SUPER_SECRET, { expiresIn: '7d' });
      res.status(HTTP_STATUS_OK).send({ token });
    })
    .catch((err) => {
      if (err instanceof UnauthorizedError) {
        next(err);
        return;
      }
      next(new UnhandledError('Server has broken while trying to create new user'));
    });
};

const updateUserInfo = (req, res, next, profileFieldsToUpdate) => {
  User.findByIdAndUpdate(
    req.user._id,
    profileFieldsToUpdate,
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

const updateProfile = (req, res, next) => {
  updateUserInfo(req, res, next, {
    name: req.body.name,
    about: req.body.about,
  });
};

const updateAvatar = (req, res, next) => {
  updateUserInfo(req, res, next, {
    avatar: req.body.avatar,
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getCurrentUser,
};

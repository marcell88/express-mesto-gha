const mongoose = require('mongoose');

const Card = require('../models/cards');

const BadRequestError = require('../errors/BadRequestError');
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');
const UnhandledError = require('../errors/UnhandledErrod');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      throw new UnhandledError('Server has broken while trying to get all cards');
    })
    .catch((err) => next(err));
};

const deleteCardById = (req, res, next) => {
  Card.findByIdAndDelete(req.params.id)
    .orFail(() => { throw new mongoose.Error.DocumentNotFoundError(); })
    .then(() => res.status(200).send({ message: 'Deleted successfully' }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        throw new DocumentNotFoundError('Card with such id has not found');
      }
      if (err instanceof mongoose.Error.CastError) {
        throw new BadRequestError('Please enter correct card id');
      }
      throw new UnhandledError('Server has broken while trying to delete the card');
    })
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new BadRequestError('Incorrect data were send to server for card creation');
      }
      throw new UnhandledError('Server has broken while trying to create new card');
    })
    .catch((err) => next(err));
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => { throw new mongoose.Error.DocumentNotFoundError(); })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        throw new DocumentNotFoundError('Card with such id has not found');
      }
      if (err instanceof mongoose.Error.ValidationError) {
        throw new BadRequestError('Incorrect data were send to server during card liking');
      }
      if (err instanceof mongoose.Error.CastError) {
        throw new BadRequestError('Please enter correct card id');
      }
      throw new UnhandledError('Server has broken while trying to like the card');
    })
    .catch((err) => next(err));
};

const deleteLikeOfCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => { throw new mongoose.Error.DocumentNotFoundError(); })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        throw new DocumentNotFoundError('Card with such id has not found');
      }
      if (err instanceof mongoose.Error.ValidationError) {
        throw new BadRequestError('Incorrect data were send to server during card disliking');
      }
      if (err instanceof mongoose.Error.CastError) {
        throw new BadRequestError('Please enter correct card id');
      }
      throw new UnhandledError('Server has broken while trying to dislike the card');
    })
    .catch((err) => next(err));
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  deleteLikeOfCard,
};

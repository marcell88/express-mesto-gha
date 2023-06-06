const linkRegex = /^http(s)?:\/\/(www\.)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+\.[a-zA-Z0-9]{1,6}(\/[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+)?#?$/;
const idRegex = /[a-zA-Z0-9]{24,24}/;

module.exports = {
  linkRegex,
  idRegex,
};

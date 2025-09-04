module.exports = function randomArbitrary (min, max) {
  return parseInt(Math.random() * (max - min) + min, 10)
}

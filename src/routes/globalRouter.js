const express = require('express');
const routes = require('../globals/routes.js');

const globalRouter = express.Router();

globalRouter.get(routes.root, function (req, res, next) {
  res.send("HelloWorld");
});

module.exports = globalRouter;

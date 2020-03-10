require('dotenv/config');
const cors = require('cors');
const express = require('express');
require('express-async-errors');
const path = require('path');
const Youch = require('youch');
const Sentry = require('@sentry/node');
const routes = require('./routes');
require('./database');
const sentryConfig =  require('./config/sentry');
// import bodyParser from 'body-parser';
class App {
  constructor() {
    this.server = express();
    Sentry.init(sentryConfig);

    // this.server.use(bodyParser.json());
    // this.server.use(bodyParser.urlencoded({ extended:true }));
    this.middlewares();
    this.routes();
    this.exception();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
    this.server.use(
      '/albuns',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
    this.server.use(
      '/posts',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
    this.server.use(
      '/banners',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exception() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.APP_ENV === 'local') {
        const errors = await new Youch(err, req).toJSON();
        if(err.code === 'LIMIT_FILE_SIZE'){
          return res.status(500).json("Tamanho excedido. A foto deve conter no máximo 1Mb.");  
        }
        return res.status(500).json(errors);
      }
      return res.status(500).json({ error: 'Internal error' });
    });
  }
}

module.exports = new App().server;

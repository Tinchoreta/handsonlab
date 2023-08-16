import express from 'express';
import { join } from 'path';
import logger from 'morgan';
import { engine } from 'express-handlebars';

import mainRouter from './routes/index.js'
import DataBaseStrategy from './persistence/DataBaseStrategy.js';

import errorHandler from './middlewares/utils/errorHandler.js';
import notFoundHandler from './middlewares/utils/notFound.js';
import { cartMiddleware } from './middlewares/business/cartMiddleware.js';

import Handlebars from './helpers/handlebarsHelper.js';
import __dirname from './utils.js'

import passport from 'passport';
import inicializePassport from './config/passportConfig.js';

import { config } from './config/config.js';

import winstonLogger from './config/logger.js';
import cors from 'cors';

const app = express();

let URI = config.MONGO_DB_URI;

let dataBaseStrategy = new DataBaseStrategy(URI);

async function connect() {
    try {
        await dataBaseStrategy.connect();
        console.log('Database Connected');
    } catch (error) {
        console.log(error);
    }
}

// app.use(cors);

//Conectar la base de datos
connect();


//Uso de logging de Winston

app.use(winstonLogger);

//Para hacer una especie de contexto de React para el carrito de compras
app.use(cartMiddleware);

//Passport 

inicializePassport();
app.use(passport.initialize());


//middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', mainRouter);
app.use('/', express.static(join(__dirname, '../public')));


//template engine
app.engine('handlebars', engine({ handlebars: Handlebars }));

app.set('views', __dirname + '../../views');
app.set('view engine', 'handlebars');

app.use(errorHandler);
app.use(notFoundHandler);

export default app;


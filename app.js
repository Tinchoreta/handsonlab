import express from 'express';
import __dirname from './utils.js'
import mainRouter from './routes/index.js'
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFound.js';
import { engine } from 'express-handlebars';
import {join} from 'path';
import logger from "morgan";

const app = express()


//middlewares   
//app.use('/',express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/', mainRouter);
app.use('/',express.static(join(__dirname, 'public')));
app.use(logger("dev"));

//template engine
app.engine('handlebars', engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')


app.use(errorHandler)
app.use(notFoundHandler)



export default app;
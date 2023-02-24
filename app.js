const express = require('express');
const { get } = require('http');
const morgan = require('morgan');

const { CLIENT_RENEG_LIMIT } = require('tls');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//1 MIDDLEWARE

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(process.env.NODE_ENV);
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

//MIDDLEWARES:

// app.use((req,res,next)=>{
//     console.log('Hello from the middleware');
//     next();
// })

// app.use((req,res,next)=>{
//     req.requestTime=new Date().toString();
//     console.log(req.headers)
//     next();
// })

//2.ROUTE HANDLERS-controllers

//3.ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.use(globalErrorHandler);

//to handle all routes(get,put,patch etc)-> app.all
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); //passing err to this middleware means it goes straight to the error handling middleware
});

//4.START SERVER
module.exports = app;

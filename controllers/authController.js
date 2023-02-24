const User=require('./../models/userModel');
const catchAsync=require('./../utils/catchAsync')
const jwt=require('jsonwebtoken')
const AppError = require('./../utils/appError');
const {promisify}=require('util')

const signToken=id=>jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn : process.env.JWT_EXPIRES_IN
});

exports.signup=catchAsync(async(req,res,next)=>{

    const newUser=await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm
    });

const token=signToken(newUser._id); 

     res.status(201).json({
        status:'success',
        token,
        data:{
            user:newUser
        }
     });
});

exports.login=catchAsync(async(req,res,next)=>{
const {email,password}=req.body;

//1 check if there is email and passwword
if(!email||!password){
    return next(new AppError('Please provide email and password'),400);
}
//2 check if user exists and password is real
const user = await User.findOne({email}).select('+password')//+ is used for hidden fields(password should be hidden)
const correct = await user.correctPassword(password,user.password)

if(!user||!correct){
return next(new AppError('Incorrect email or password',401))
}

//3 if everything is ok, send token to client
const token=signToken(user._id);
res.status(400).json({
    status:'success',
    token
})
});

exports.protect=catchAsync(async(req,res,next)=>{
    let token;
    //1. Get token if it exists
if((req.headers.authorization).startsWith('Bearer')){
token=req.headers.authorization.split(' ')[1];
// console.log(token)
}
    if(!token){
        return next(new AppError('You are not logged in! Please login in to get access.',401));
    }

    //2. Verification of token
const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)
console.log(decoded)
    //3. Check if user still exists

    //4. Check if user changed password after the token was issued
    next();
})

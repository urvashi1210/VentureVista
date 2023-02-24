const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please tell us your name'],
        unique:true,
        trim:true,
    },
    email:{
        type:String,
        required:[true,'Please provide your email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide a valid email']
    },
    photo:{
        type:String,
    },
    password:{
        type:String,
        required:[true,'Please provide a password'],
        minlength:8,
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please confirm your password'],
        validate:{
            //works only on save and create (not update)
            validator:function(el){
                return el===this.password
            },
            message:'Passwords are not the same!'
        
        }
    }
})

userSchema.pre('save',async function(next){
//Only run if password was modified
if(!this.isModified('password'))
return next();

//Hash the password with the cost of 12
this.password=await bcrypt.hash(this.password,12);

//Delete passwordConfirm field
this.passwordConfirm=undefined;
});

//INSTANCE METHOD-accessible to all documents of a collection(all users(documents) of the User collection )
userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
    //candidatePassword is original and userPassword is encryped by bcryptJJsonWebToken
}

const User=mongoose.model('User',userSchema)

module.exports=User;
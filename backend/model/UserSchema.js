const mongoose =require('mongoose');
const bcrypt =require('bcryptjs');
const jwt =require('jsonwebtoken');
const userSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    },
    // people:{
    //     type:String,
    //     enum:['Admin','Client'],
    //     required:true
    // },
    tokens:[
        {
            token:{
                type:String,
                required:true,
            }
        }
    ]
})

userSchema.pre("save", async function () {
    const user = this;
    //console.log("actual data ", this);
  
    if (!user.isModified) {
      return next();
    }
  
    try {
      const saltRound = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, saltRound);
      const chashedPassword = await bcrypt.hash(user.cpassword, saltRound);
      user.password = hashedPassword;
      user.cpassword = chashedPassword;
    } catch (error) {
      return next(error);
    }
  });
userSchema.methods.generateAuthToken =async function(){
    try{
        let token =jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(err){
        console.log(err);
    }
};


const User =mongoose.model('USER',userSchema);
module.exports=User;
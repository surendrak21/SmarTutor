const express=require('express');
const jwt=require('jsonwebtoken');
const router =express.Router();
const bcrypt=require('bcryptjs');
require('../db/conn');
const authenticate= require("../middleware/authenticate");

const User= require("../model/UserSchema");

router.get('/',(req,res)=>{
    res.send("Hello World");
});

// router.post('/register', (req,res)=>{
//     const {name,email,phone,password,cpassword}=req.body;

//     if(!name|| !email || !phone || !password || !cpassword)
//     return res.status(422).json({error:"plzz fiels the field"});

//     User.findOne({email:email})
//     .then((userExist)=>{
//         if(userExist){
//             return res.status(422).json({error:"plzz fiels the field"}); 
//         }
//         const user= new User({name,email,phone,password,cpassword});

//         user.save().then(() => {
//             res.status(201).json({error:"plzz fiels the field"});
//         }).catch((err)=>  res.status(500).json({error:"plzz fiels the field"}));
//     }).catch((err)=>console.log("failed"))
// });
router.post('/signup', async (req,res)=>{
    const {name,email,phone,password,cpassword}=req.body;

    if(!name|| !email || !phone || !password || !cpassword)
    return res.status(422).json({error:"plzz fiels the field"});


    try {
      const userExist=  await User.findOne({email:email});
        if(userExist){
            return res.status(422).json({error:"plzz fiels the field"}); 
        }else if(password!=cpassword){
            return res.status(422).json({error:"plzz fiels the field"}); 
        }else {
            const user= new User({name,email,phone,password,cpassword});
            await user.save();
            console.log(res.body);
            res.status(201).json({error:"succesfully registred"});
        }

    } catch(err){
         console.log(err);
    }
});

router.post('/login' , async (req,res)=>{
    try{
        const {email,password} =req.body;
        if(!email || !password){
            return res.status(400).json({error:"plzz filled the data"});
        }
        const userLogin =await User.findOne({email:email});
        if(userLogin){
            const isMatch =await bcrypt.compare(password,userLogin.password);
            const token= await userLogin.generateAuthToken();

            res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+25892000000),
                httpOnly:true,
            });
            if(!isMatch)
            res.status(400).json({error:"Invalid Credential"});
            else {
                res.json({message:"successfully"});
            }
        } else {
            res.status(400).json({error:"Invalid Credential"});
        }
        

    } catch(err){
        console.log(err);
    }

})
router.post('/logout' , async (req,res)=>{
        res.clearCookie('jwtoken',{path:'/'});
        res.status(200).send("user logout");
})

router.get('/preregistration',authenticate,(req,res)=>{
    res.send(req.rootUser);
});
router.get('/courseclash',authenticate,(req,res)=>{
    res.send(req.rootUser);
});
router.get('/courses',authenticate,(req,res)=>{
    res.send(req.rootUser);
});
router.get('/announcement',authenticate,(req,res)=>{
    res.send(req.rootUser);
});


module.exports = router;
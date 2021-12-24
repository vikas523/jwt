const jwt= require('jsonwebtoken')
const students=require('../models/register')


const auth= async(req,res,next)=>{
    try {
        const token =req.cookies.jwt;
        const verifyuser=jwt.verify(token,process.env.SECRET_KEY);
        console.log(verifyuser);
        const users = await students.findOne({_id:verifyuser._id})
        console.log(users);
        res.token= token;
        req.users = users;
        next()
        
    } catch (error) {
        res.status(401).send(error)
        
    }
}

module.exports = auth;
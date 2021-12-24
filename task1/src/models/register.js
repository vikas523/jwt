
const mongoose=require("mongoose")
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken')


var studentSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

});


studentSchema.methods.generateAuthToken = async function(){
    try {
        console.log(this._id)
        const token = jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token})
        // console.log(token);
        await this.save();
        return token;
    } catch (error) {
    console.log(error);
    }
}

studentSchema.pre("save", async function(next){
    if(this.isModified('password')){
        // console.log(`the current password is ${this.password}`);
        this.password=await bcrypt.hash(this.password,10);
        // console.log(`the current password is ${this.password}`);

        this.confirmpassword = await bcrypt.hash(this.password,10);
    }
    next();
})

module.exports = mongoose.model("students",studentSchema);





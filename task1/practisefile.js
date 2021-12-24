// const register = require("./src/models/register");

// const register = require("./src/models/register");

// app.use(express.json())
// app.use(express.urlencoded({extended:true}))



// app.get('/register',async(req,res)=>{
//     try {
//   const pass = req.body.password;
//   const cpass= req.body.confirmpassword

//     if(pass === cpass){
       
//         const insertdata = new register({
//             firstname:req.body.firstname,
//             lastname:req.body.lastname
//         })
//        const dbdata = await insertdata.save()


//     }else{
//         res.send("password and confirm password should be matched")
//     }
   

        
//     } catch (error) {
//         console.log("password are not matching");
//     }
// })



// 2 topic port
// port = process.env.PORT || 3000


// static file

// require('path')

// const static_path = path.join(__dirname,"../")

// app.use(express.static(static_path))

// app.get('/',(req,res)=>{
//     res.render('')
// })





// views
// require('hbs')

// const view_path=path.join(__dirname,"../")



// app.set("views engine","hbs")
// app.set("view",view_path)

// partial
// navbar=<h1>navbar ka code</h1>

// login={{>navbar}}
// register={{>navbar}}
// index={{>navbar}}


// const partial_path=path.join(__dirname,"../")
// hbs.register(partial_path)


// conn

// const mongoose=require('mongoose')
// mongoose.connection("",{

// }).then(()=>{
//     console.log("connected");
// }).catch(()=>{
//     console.log("not connected");
// })

// schema
// const mongoose = require('mongoose')
// const employeSchema=new mongoose.Schema({
//     name:{
//         type:String,
//         require:true,
//     }
// })

// const register = new mongoose.model("Register",employeSchema)

// module.exports= register


// // app.js=>import krna h
// const register = require("./")

// login api

// app.post('/login',async(req,res)=>{
//     try {

//     const email = req.body.email;
//     const pass = req.body.password;

// const useremail = await register.findOne({email:email})
// if(useremail.password===pass){
//     res.render('home')
// }
// else{
//     res.send("invalid details")
// }  
//     } catch (error) {
//         res.send("invalid credential")
//     }
// })

// hashing algorithm

// const require('bcrypt')

// // employeeSchema.pre("save",function(next){
// //     const passwordhash= await bcrypt.hash(password,10)
// //     next()
// // })


// employeeSchema.pre("save",async function(next){
//     this.password=await bcrypt.hash(this.password,10)
//     console.log(this.password)
//     next()
// })

// app.get('/',aysnc(req,res)=>{
//     try {
        
//      const password = req.body.password;
//      const cpaasword = req.body.confirmpassword
     
//      if(password === cpassword){
//          const employee = new registerd({})

//          const registerd = await dog.save()
//      }
   



//     } catch (error) {
//         console.log(error);
//     }
// })
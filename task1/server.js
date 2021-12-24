require('dotenv').config();
const express = require('express');
const cookieparser = require('cookie-parser')
const app = express();
const http = require('http');
const path = require('path')
const hbs = require('hbs')
const bcrypt = require('bcryptjs')
const student = require('./src/models/register')
const port = process.env.PORT || 3000;
require('./src/models/db/conn')
require('./src/models/db/chat')
var ObjectId = require('mongodb').ObjectId; 
const auth = require('./src/middleware/auth')

const static_path = path.join(__dirname, "./public")
const templates_path = path.join(__dirname, "./templates/views")
const partials_path = path.join(__dirname, "./templates/partials")


app.use(express.json())
app.use(cookieparser())
app.use(express.urlencoded({ extended: false }))


app.use(express.static(static_path))
app.set('view engine', 'hbs');
app.set("views", templates_path)
hbs.registerPartials(partials_path)

console.log(process.env.SECRET_KEY);

const server = http.createServer(app);
const WebSocket = require('ws');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/tutorial";

const wss = new WebSocket.Server({ server: server });
const socketsLookuop = new Map();
const userList = [];


wss.on("connection", function connection(ws, request) {
    console.log("web socket connected")
    // console.log("request url", request.url);
    const userId = request.url.replace("/","");
    socketsLookuop.set(userId, ws);
    MongoClient.connect(url, function(err, db) {
       
        var dbo = db.db("tutorial");
        const id = new ObjectId(userId);
        dbo.collection("students").find({_id : id }).toArray(function(err, result)  {
          if (err) throw err;
          console.log("user id on connect", result);
          db.close();
          userList.push({id: request.url.replace("/",""), firstname: result[0].firstname})
          socketsLookuop.forEach((item) => {
            item.send(JSON.stringify({users :  userList}))
            
          })
        });
       
      });
   
    
    wss.on('disconnect',()=>{
        console.log("disconnected");
    })

    ws.on("message", (data) => {
    const {action, message, sender, target} = JSON.parse(data.toString())
    const  created_at = new Date()
    const timestamps = new Date().getTime();
    
    if(action === "SEND_MESSAGE"){
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("tutorial");
          var myobj = { senderID:sender, RecieverID: target,Message : message,timestamps,  created_at,};
          dbo.collection("chatlogs").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("data is inserted....");
            db.close();
          });
        });
        socketsLookuop.forEach((client, i) => {
            if(ws == client || JSON.parse(data.toString()).target == i && client.readyState === WebSocket.OPEN)
            client.send(data.toString())
          })
    }
    else if(action === "GET_MESSAGES"){

      const {action, message, sender, target} = JSON.parse(data.toString())

      //mogo db 
      const responseData = {sender, target, action}
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("tutorial");
       
        console.log("sender", sender)
        dbo.collection("chatlogs").find({$and:[{senderID: {$in: [sender, target]}},{RecieverID: {$in: [sender, target]}}]}).toArray(function(err, result)  {
          if (err) throw err;
          responseData["messages"] = result
          console.log(result);
          db.close();
          socketsLookuop.forEach((client, i) => {
            if(ws == client && client.readyState === WebSocket.OPEN)
            client.send(JSON.stringify(responseData))
          })
        });
       
      });
       
    }
    })
    
})
app.get('/', (req, res) => {
    res.render("index")
})

app.get('/secret', auth, (req, res) => {
    // console.log(`this is our cookies ${req.cookies.jwt}`);
    res.render('secret')
})

app.get('/logout', auth, async (req, res) => {
    try {
        console.log(req.users);
    //   req.users.tokens=req.users.tokens.filter((currentElement)=>{
    //       return currentElement.token !== req.token
       //   })
        req.users.tokens = [];

        res.clearCookie('jwt')

        await req.users.save()
        res.render('login')
        console.log('logout succesfully');

    } catch (error) {
        res.status(403).send(error)
    }

    // res.render('secret')
})

// register
app.get('/register', (req, res) => {
    res.render('register')
})
app.post('/register', async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const User = new student({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: password,
                confirmpassword: cpassword,

            })
            const token = await User.generateAuthToken();

            //  to generate the cookies
            const cookie = res.cookie('jwt', token, {
                expires: new Date(Date.now() + 30000),
                httpOnly: true
            });
            console.log(cookie)

            User.save().then(result => {
                    res.render("login")
                })

            // console.log("user id ", User.id)
            
        }
        else {
            res.send("password and confirm password should be same")
        }
    }
    catch (error) {
        console.log(error)
    }
})

// login part

app.get('/login', (req, res) => {
    res.render('login')
})

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const isMatch = await student.findOne({ email: email })
        const bp = await bcrypt.compare(password, isMatch.password)
        const token = await isMatch.generateAuthToken();
        
         console.log("email",isMatch.id);
     
        const cookie = res.cookie('jwt', token, {
            expires: new Date(Date.now() + 30000),
            httpOnly: true
        });

        // console.log(cookie)
        if (bp) {
         
            res.status(201).render('chat',{isMatch:isMatch.id});
      // res.status(201).send(`<h1> please chek ur detail in database </h1>`   
            
        } else {
            res.send("Invalid password details")
        }
    }
    catch (error) {
        res.status(400).send("invalid error")
    }
})


server.listen(port, () => {
    console.log(`server is running at ${port}`);
})


const express = require("express");
const jwt = require("jsonwebtoken")
const JWT_SECRET = "iloveaashima"
const app = express();
const users = [];

// function generateToken(){
//     let token = "";
//     const options = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'];

//     for(let i=0;i<32;i++){
//         token += options[Math.floor(Math.random()*options.length)];
//     }
//     return token;
// }

function authMiddleware(req,res,next){
    const token = req.headers.token;

    const decodedData = jwt.verify(token,JWT_SECRET);
    if(decodedData){
        req.user = decodedData.username;
        next();
    }
    else{
        res.json({
            msg:"User not authorized!"
        });
    }
}

app.use(express.json());

app.get("/",function(req,res){
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/signup",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    if(users.find(user => (user.username == username))){
        res.json({
            message:"User already exists!"
        })
    }
    else{
        users.push({
            username,
            password
        });
        res.json({
            message:"You have successfully signed up!"
        });
    }

});

app.post("/signin",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    let finduser;
    users.find(function(user){
        if(user.username == username && user.password == password){
            finduser = user;
        }
    });

    if(finduser){
        // const token = generateToken();
        const token = jwt.sign({
            username:finduser.username
            // username:username
        },JWT_SECRET)
        // finduser.token = token;
        res.json({
            token
        })
    }
    else
    res.json({
        token:undefined
})

});

app.get("/me",authMiddleware,function(req,res){
    const finduser = users.find(user => user.username === req.user);

    if (finduser) {
        const password = finduser.password;
        res.json({
            username: req.user,
            password
        });
    } else {
        res.status(404).json({
            msg: "User not found!"
        });
    }
});

app.listen(3000);
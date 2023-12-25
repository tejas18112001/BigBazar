
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
mongoose.connect('mongodb+srv://tejasraut461:Tejas%40123@cluster0.uiwnzmf.mongodb.net/')
    .then(() => console.log('Connected!'));

const Users = mongoose.model('Users', { username: String, password: String });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 4000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/signup', (req, res) => {
    
    const userN = req.body.username;
    const pass = req.body.password;
    const user = new Users({ username: userN, password: pass });
   
    user.save()
        .then(() => {
           res.send({ message: "Saved Successfully." });
        })
        .catch((err) => {
            res.send({ message: "Server error", error: err });
        });
});


app.post('/login', (req, res) => {
    
    console.log(req.body) ;
    const userN = req.body.username;
    const pass = req.body.password;
   
 
    Users.findOne({username : userN})
        .then((result) => {
            console.log(result , "user data") ;
            
            
            if(!result) {
                res.send({message : "user not found."}) ;
            } else {
                 
                if(result.password == pass) {
                    const token = jwt.sign({
                        data: result
                    }, 'MYKEY', { expiresIn: '1h' });
                    res.send({message : "Login Sucessful!!" , token : token}) ;
                }
                if(result.password != pass) {
                    res.send({message : "Wrong Password!!"}) ;

                }
            }
           
        })
        .catch((err) => {
            
            res.send({ message: "Server error", error: err });
        });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path') ;
mongoose.connect('mongodb+srv://tejasraut461:Tejas%40123@cluster0.uiwnzmf.mongodb.net/')
    .then(() => console.log('Connected!'));


const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
const upload = multer({ storage: storage })


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads'  , express.static(path.join(__dirname , 'uploads'))) ;

const port = 4000;
const ObjectId = require('mongodb').ObjectId;

const Users = mongoose.model('Users', 
                             { username: String, 
                                password: String ,
                                likeProducts : [{type : mongoose.Schema.Types.ObjectId , ref :'Products'}]
                            });
const Products = mongoose.model('Products', { pname: String, pdesc: String , pprice: String, ptype: String , pimage : String });


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/like-products/' , (req , res) =>  {
      
     console.log(req.body) ;
     const userId = req.body.userId  ;
     const productId = req.body.productId ;
      

     
     Users.updateOne({_id : new ObjectId(userId)} , {$addToSet : {likeProducts : productId}})
     .then(() => {

        res.send({ message: "Liked Successfully." , userId :userId ,productId:productId });
     })
     .catch((err) => {
         res.send({ message: "Server erro r", error: err });
     });
})


app.get('/get-likeProducts:userId' , (req , res) => {
    let userId = (req.params.userId).substring(1);
   
  
  Users.findOne({ _id: userId }).populate('likeProducts')
    .then((result) => {
      if (result) {
        
        res.send({ likeProducts: result.likeProducts});
      } else {
        
        res.status(404).send({ message: 'User not found' });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error occurred");
    });



})

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
            // console.log(result , "user data") ;
            
            
            if(!result) {
                res.send({message : "user not found."}) ;
            } else {
                 
                if(result.password == pass) {
                    const token = jwt.sign({
                        data: result
                    }, 'MYKEY', { expiresIn: '1h' });

                    const userId = result._id ;
                    res.send({message : "Login Sucessful!!" , token : token , userId : userId}) ;
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



app.post('/add-product',upload.single('pimage'), (req, res) => {
    
    const pname = req.body.pname;
    const pdesc = req.body.pdesc;
    const pprice = req.body.pprice;
    const ptype = req.body.ptype;
    const pimage = req.file.path;
    const product = new Products({ pname, pdesc , pprice , ptype, pimage });
   
    product.save()
        .then(() => {
           res.send({ message: "Saved Successfully." });
        })
        .catch((err) => {
            res.send({ message: "Server error", error: err });
        });
    return  ;
   
});

app.get('/get-products' , (req, res) =>{
      
   
     Products.find()
    .then((result) =>{
          res.send({message :"sucess" , products : result}) ;
    })
     .catch(()=>{
        res.send("Error occured")
     })
})
    


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

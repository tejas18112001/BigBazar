const mongoose = require('mongoose');

const usersSchema =   {  username: String, 
    password: String ,
    email :   String ,
    mobile :  String ,
    likeProducts : [{type : mongoose.Schema.Types.ObjectId , ref :'Products'}]
} ;

const productSchema = { 
    pname: String, 
    pdesc: String , 
    pprice: String, 
    ptype: String , 
    pimage : String ,
    addedBy : mongoose.Schema.Types.ObjectId 

}

const Users = mongoose.model('Users', usersSchema ) ;
const Products = mongoose.model('Products', productSchema) ;
module.exports = {Users , Products} ;

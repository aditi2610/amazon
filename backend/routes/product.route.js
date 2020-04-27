const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
var multer = require('multer')
const  multerS3 = require('multer-s3');
// const kafka = require('../kafka/client');

const Product = require('../models/product');

const Seller = require('../models/seller');
// The name of the bucket that you have created
const BUCKET_NAME = 'test-demo-amazon2';
const s3 = new AWS.S3({
    accessKeyId: process.env.ID,
    secretAccessKey: process.env.SECRET
});

const fileFilter = (req,file,cb) => {
    if(file.mimetype === 'image/jpeg' ||file.mimetype === 'image/png')
        cb(null,true);
    else    
        cb(null,false);
};

var multipleUpload  = multer({
    storage: multerS3({
      s3: s3,
      bucket: BUCKET_NAME,
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
          console.log(req.body);
          let folderName = req.body.name.toLowerCase().split(' ').join('-');
          console.log("Multer Called",folderName);
        cb(null,req.body.seller+'/'+ folderName +'/' +Date.now().toString()+ file.originalname)
      }
    })
  }).array("file")


//const { mongoose } = require('../../kafka-backend/models');
//const Customer = mongoose.model('Customer');
//const Product = mongoose.model('Product');

// const makeKafkaRequestCart = async (req, res) => {
//     //console.log("Make request Product route");
//     kafka.make_request('product', { body: req.body, params: req.params }, (err, results) => {
//         if (err) {
//             console.log('Error:', err);
//             res.json({
//                 status: 'error',
//                 msg: 'System Error, Try Again.',
//             });
//         } else {
//             console.log("results are: ", results);
//             res.json(results);
//         }
//     });
// }

// get All Products
router.route('/getAllProducts').get((req, res) => {
    //performance
    Product.find().populate('seller').limit(10).exec((err, categories) => {
        if(err){
            console.log("Error is: ", err);
        }
        if(categories){
            console.log("categories are: ", categories);
            res.json(categories);
        }
    });
    //console.log("req.body in getALl Products: ", req.body);
    // req.params.path = 'get-all-products';
    // makeKafkaRequestCart(req, res);
});

// router.route('/:productId/').get((req,res)=>{
//     console.log("Product route: ", req.body);
//     req.param.path = 'get-product';
//     makeKafkaRequestCart(req, res);
// })

// // Add Product
// router.route('/addProduct').post( (req, res) => {
    
//     let productImages = [];

//     console.log("req.body in getALl Products: ", req.body);
//     console.log("req.files in getALl Products: ", req.files , req.file);

//     multipleUpload(req,res,function (err) {
//         if (err instanceof multer.MulterError) {
//             return res.json({"status" :400,"error" :err.message})
//         } else if (err) {
//             return res.json({"status" :400,"error" :err.message})
//         } else {
//             console.log(req.files);
//             for(var i=0;i< req.files.length ; i++) {
//                 productImages.push({ "imageUrl" :  req.files[i].location  });
//         }
//          console.log(productImages);
//          const productObj = {
//             "name" : req.body.name,
//             "seller" : req.body.seller,
//             "productCategory" : req.body.productCategory,
//             "price" : req.body.price,
//             "description" : req.body.desc,
//             "images" : productImages
//         }
        
//          req.body.productObj = productObj;
//          req.params.path = 'add-products';
//          makeKafkaRequestCart(req, res);
//         }
//     });
// });

module.exports = router;
var express= require('express'),
            app=express(),
            port=3000,
            mongojs=require('mongojs');

    var db=mongojs('contactlist',['contactlist']);
    var bodyPaser=require('body-parser');   
    var multer = require('multer');     


app.use(express.static(__dirname +"/public"));
//app.use(express.static('../public'));
app.use(bodyPaser.json());

app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get('/contactList', function(req,res){
    console.log("i received a GET request");
   
    db.contactlist.find(function(err,data){
      console.log(data);
      res.json(data);
    });
});
app.post('/contactList',function(req,res){
    console.log(req.body);
    db.contactlist.insert(req.body,function(err,data){
        res.json(data);
    });
});
app.delete('/contactList/:id',function(req,res){
    var id= req.params.id;
    console.log(id);
    db.contactlist.remove({_id:mongojs.ObjectId(id)}, function(err,data){
        res.json(data);
        console.log(data);
    });
});
app.get('/contactList/:id',function(req,res){
    var id=req.params.id;
    console.log(id);
    db.contactlist.findOne({_id :mongojs.ObjectId(id)},function(err,data){
        res.json(data);
        console.log(data);
    });
});
app.put('/contactList/:id',function(req,res){
    var id=req.params.id;
    console.log(req.body.name);
    db.contactlist.findAndModify({
     query:{_id:mongojs.ObjectId(id)},
     update:{$set:{name: req.body.name , email:req.body.email,number:req.body.number, file:req.body.file}},
    new:true}, function(err,data){
         res.json(data);
     }   
    );
});


var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './server/uploads/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

var upload = multer({ //multer settings
                storage: storage
            }).single('file');

/** API path that will upload the files */
app.post('/upload', function(req, res) {
    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
         res.json({error_code:0,err_desc:null});
    });
});



app.listen(port);

console.log("server started at "+port);
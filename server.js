var express= require('express'),
            app=express(),
            port=3000,
            mongojs=require('mongojs');

    var db=mongojs('contactlist',['contactlist']);
    var bodyPaser=require('body-parser');        


app.use(express.static(__dirname +"/public"));
app.use(bodyPaser.json());

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
     update:{$set:{name: req.body.name , email:req.body.email,number:req.body.number}},
    new:true}, function(err,data){
         res.json(data);
     }   
    );
});



app.listen(port);

console.log("server started at "+port);
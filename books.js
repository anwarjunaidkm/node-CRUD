import { MongoClient, ObjectId } from "mongodb";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

var app = express();
var db;
app.use(cors());
//----json
var jsonParser = bodyParser.json();
//----for urlencode
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const uri ="enter youd db link"
 
MongoClient.connect(uri, function (err, client) {
  if (err) throw error;
  console.log("Connected to mongo");
  db = client.db("classday");
});

//-----------get all books-----------
app.get("/books", function (req, res) {
  db.collection("books")
    .find({})
    .toArray(function (err, data) {
      if (err) throw err;
      // console.log(data)
      res.send(data);
      // console.log(ObjectId())
    });
});

//--------get single book---------
app.get("/book/:id", function (req, res) {
  const id = req.params.id;
  const mongoId = new ObjectId(id);
  db.collection("books").findOne({ _id: mongoId }, function (err, data) {
    if (err) throw err;
    //  console.log(data)
    res.send(data);
    // console.log(mongoId);
  });
});

//----------post newbook------------
app.post("/books/", jsonParser, function (req, res) {
  let book_title = req.body.book_title;
  let description = req.body.description;
  let author = req.body.author;
  let price = req.body.price;
  db.collection("books").insertOne(
    {
      book_title: book_title,
      description: description,
      author: author,
      price: price,
    },
    function (err, data) {
      if (err) {
        res.send({ error: "inserting faild" });
      } else {
        res.send({ success: "inseting successs" });
      }
    }
  );
});
//<-------------------updatee--book-------------->

app.patch("/book/:id", jsonParser, function (req, res) {
  const id = req.params.id;
  const mongoId = new ObjectId(id);

  const updateObject = {}
 
  if(req.body.book_title){
    updateObject.book_title = req.body.book_title
  }
  if(req.body.description){
    updateObject.description = req.body.description
  }
  if(req.body.author){
    updateObject.author = req.body.author
  }
  if(req.body.price){
    updateObject.price = req.body.price
  }

  db.collection("books").updateOne(
    { _id: mongoId },
    {
      $set: updateObject,
    },
    function (err, data) {
      if (err) {
        res.send({ error: "update failed" });
      } else {
        res.send({ success: "update success" });
      }
    }
  );
});

//-----deletea book---------
app.delete("/book/:id", function (req, res) {
  const id = req.params.id;
  const mongoId = new ObjectId(id);
  db.collection("books").deleteOne({ _id: mongoId }, function (err, data) {
    if (err) {
      res.send({ error: "delete faild" });
    } else {
      res.send({ success: "delete success" });
    }
  });
});
app.get("/", function (req, res) {
  res.send("hello");
});

app.listen(8080, function () {
  console.log("server started");
});

// // Connection URI
// const uri ="mongodb+srv://faisalnksaif:yourClassDay1@cluster0.iaoqh.mongodb.net/classday?retryWrites=true&w=majority"
// MongoClient.connect(uri,function(err,client){
//     if(err) throw error;
//     console.log("Connected to mongo");
//     var db =client.db("classday")
//     db.collection("teachers").find({name:"anwar"}).toArray(function(err,result){
//         if(err) throw error
//         console.log(result);
//         client.close()
//     })

//  })

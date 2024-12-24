const {MongoClient} = require("mongodb");
const URL = "mongodb://localhost:27017";
const client = new MongoClient(URL);

const express = require('express');
const eobj = express();
port = 5200;

//Handling cors Cross Origine Resource sharing
eobj.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin",
    "http://localhost:4200");
  
    res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type, Accept");
  
    next();
});

async function GetConnection() 
{
    let result = await client.connect();
    let db = result.db("MarvellousRestaurants");
    return db.collection("Restaurants");
}

eobj.get('/restaurants', async (req, res) => {
    try {
        const collection = await GetConnection();
        const data = await collection.find().toArray();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).send("Internal Server Error");
    }
});

// API Endpoint to add a restaurant
eobj.post('/restaurants', async (req, res) => {
    try {
        const collection = await GetConnection();
        const newRestaurant = req.body; // This will include the posts object
        await collection.insertOne(newRestaurant);
        res.status(201).json(newRestaurant);
    } catch (error) {
        console.error("Error adding restaurant:", error);
        res.status(500).send("Internal Server Error");
    }
});

// API Endpoint to update a restaurant
eobj.put('/restaurants/:id', async (req, res) => {
    try {
        const collection = await GetConnection();
        const { id } = req.params;
        const updatedData = req.body; // This will include the posts object
        await collection.updateOne({ "posts.id": id }, { $set: updatedData });
        res.status(200).json(updatedData);
    } catch (error) {
        console.error("Error updating restaurant:", error);
        res.status(500).send("Internal Server Error");
    }
});

// API Endpoint to delete a restaurant
eobj.delete('/restaurants/:id', async (req, res) => {
    try {
        const collection = await GetConnection();
        const { id } = req.params;
        await collection.deleteOne({ "posts.id": id });
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting restaurant:", error);
        res.status(500).send("Internal Server Error");
    }
});

eobj.listen(port, function(req,res){
    console.log("Marvellous Server is started succesfully");
});
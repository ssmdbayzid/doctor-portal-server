const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

//user= doctor_portal

//pass= bTp7WVzdETf5tR0H

//middleware

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nahqu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    await client.connect()
    const serviceCollection = client.db("doctor_portal").collection("service")

    app.get('/service', async (req, res)=>{
        const quote = {}
        const service = serviceCollection.find(quote);
        const result = await service.toArray();
        res.send(result)
    })
}



app.get('/', (req, res)=>{
    res.send('Connected my Doctor Portal')
})

app.listen(port, ()=>{
    console.log('doctor portal run with', port)
})


run().catch(console.dir)

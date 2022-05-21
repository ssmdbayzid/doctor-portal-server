const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const { userInfo } = require('os');
require('dotenv').config()
const port = process.env.PORT || 5000;

//user= doctor_portal

//pass= bTp7WVzdETf5tR0H

//middleware

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nahqu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

    try {
        await client.connect()
        const serviceCollection = client.db("doctor_portal").collection("service")

        const bookingCollection = client.db("doctor_portal").collection("booking")

        app.get('/service', async (req, res) => {
            const quote = {}
            const service = serviceCollection.find(quote);
            const result = await service.toArray();
            res.send(result)
        })

        /**
 * API Name convention
 * app.get('./booking)  // get all bookings this collection or get more then one or by filter
 * app.get('./booking/:id) // get a specific booking
 * app.post('booking') // add a new booking
 * app.petch('booking/:id) //
 * app.delete('booking/:id') //
*/

        app.post('/booking', async (req, res) => {
            const document = req.body;
            const quote = {treatment: document.treatment, date: document.date, patient: document.patient}
            console.log(quote)
            const exist = await bookingCollection.findOne(quote)
            if(exist){
                return res.send({success: false, booking: exist})
            }
                const result = await bookingCollection.insertOne(document)
                return res.send({success: true, result})
            
        })
        
        // Patient Booked Service 

        app.get('/booking', async(req, res)=>{
            const patient = req.query.patient;

            const query = {patient: patient}
            const result = await bookingCollection.find(query).toArray()
            res.send(result)
        })
        
        // Available Services
        app.get('/available', async (req, res)=>{
            const date = req.query.date;

            // step 1: gget all services
            const services = await serviceCollection.find().toArray();
            
            // step 2: get the booking of that day
            const query = {date: date};

            const bookings = await bookingCollection.find(query).toArray()


            // step 3: for each service, find booking for that service

            services.forEach(service =>{
                const serviceBooking = bookings.filter(booking => booking.treatment === service.name)


                const booked = serviceBooking.map(s => s.slot)
                // service.booked = serviceBooking.map(service => service.slot); (demo)
                const available = service.slots.filter(slot => !booked.includes(slot))
                service.slots = available;
            })
            res.send(services)
        })
         
        

        





        app.get('/', (req, res) => {
            res.send('Connected my Doctor Portal')
        })

        app.listen(port, () => {
            console.log('doctor portal run with', port)
        })
}


    finally {
    ///// Hudai
}
    

}
run().catch(console.dir)

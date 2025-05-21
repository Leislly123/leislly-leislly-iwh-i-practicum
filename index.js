require('dotenv').config(); // ← ini wajib di baris pertama

const express = require('express');
const axios = require('axios');
const app = express();

// Ambil token dari .env
const HUB_API_KEY = process.env.HUBSPOT_API_KEY;
console.log("Token:", HUB_API_KEY); // Debug token

// ID Custom Object kamu (misalnya: Panda)
const objectTypeId = '2-16878023';

const headers = {
    "Authorization": `Bearer ${HUB_API_KEY}`,
    "Content-Type": "application/json",
};

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTE 1 - Homepage: tampilkan data custom object
app.get("/", async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${objectTypeId}?properties=name,bio,species`;

    try {
        const { data } = await axios.get(url, { headers });
        console.log("Fetched pandas:", data.results); // Debug isi data
        res.render("homepage", {
            title: "Pandas List | HubSpot Custom Object",
            pandas: data.results,
        });
    } catch (error) {
        console.error('Error fetching Panda data:', error.response?.data || error.message);
        res.status(500).send('Error fetching Panda data');
    }
});

// ROUTE 2 - Halaman form input custom object
app.get("/update-cobj", (req, res) => {
    res.render("updates", {
        title: "Update Custom Object Form | Integrating With HubSpot I Practicum",
    });
});

// ROUTE 3 - Submit form untuk menambah custom object
app.post("/update-cobj", async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${objectTypeId}`;
    const body = {
        properties: {
            name: req.body.name,
            bio: req.body.bio,
            species: req.body.species,
        },
    };

    console.log("Sending data to HubSpot:", body); // Debug body yang dikirim

    try {
        await axios.post(url, body, { headers });
        res.redirect("/");
    } catch (err) {
        console.error('Error creating Panda:', err.response?.data || err.message);
        res.status(500).send('Error creating Panda');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));

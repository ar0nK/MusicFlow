const express = require('express');
const app = express();
const PORT = 8080;
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const ngrok = require('ngrok');

app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'test.html'));
});
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.send('a szerver elindult');
});


app.listen(PORT, async () => {
    console.log(`A szerver cím: http://localhost:${PORT}`);

    try {
        
        const url = await ngrok.connect(PORT);
        console.log(`ngrok url: ${url}`);
    } catch (err) {
        console.error('Hiba az ngrok indításakor:', err);
    }
});

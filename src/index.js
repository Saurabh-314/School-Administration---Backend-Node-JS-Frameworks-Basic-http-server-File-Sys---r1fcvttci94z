const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
app.use(express.urlencoded());
let data = require('./InitialData');

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here

app.get('/api/student', (req, res) => {
    res.send(data);
})


app.get("/api/student/:id", async (req, res) => {
    const id = req.params.id;
    const isPresent = data.find((item) => item.id == id);
    if (isPresent) {
        res.status(200).send(isPresent);
    } else {
        res.status(404).send("invalid");
    }
})

app.post('/api/student', (req, res) => {
    const input = req.body;
    if (input.name != null && input.currentClass != null && input.division != null) {
        const newId = parseInt(Date.now().toString());
        const studentData = {
            id: newId,
            name: input.name,
            currentClass: parseInt(input.currentClass),
            division: input.division
        };
        data = [...data, studentData];
        res.status(200).send({ id: newId });
    } else {
        res.status(404);
    }
})

app.put('/api/student/:id', (req, res) => {
    const isPresent = data.find((item) => item.id == req.params.id);
    if (isPresent) {
        const input = req.body;
        data.map((item) => {
            if (item.id == req.params.id) {
                item.name = input.name;
                res.status(200).send();
            } else {
                res.status(400).send();
            }
        })
    } else {
        res.status(400).send();
    }

})

app.delete('/api/student/:id', (req, res) => {
    const isPresent = data.find((item) => item.id == req.params.id);
    if (isPresent) {
        data = data.filter((item) => item.id != req.params.id);
        res.send(`delete student of ${req.params.id} successfully`);
    } else {
        res.status(404).send();
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   
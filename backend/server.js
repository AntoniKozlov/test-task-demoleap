const express = require('express');
const app = express();
const PORT = 3002;
const cors = require('cors');

const data = require('./routes/data');

app.use(cors());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use('/diagramData', data);
app.use(express.static('public'));

app.use(function(req, res) {
    res.status(404).send({ info: "Incorrect route", msg: "Sorry, page not found" });
});


app.listen(PORT, function() {
    console.log(`listening on ${PORT}`);
})

module.exports = app;
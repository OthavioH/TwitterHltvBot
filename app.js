const express = require('express')
var matchIDRouter = require('./routes/matchID');

const app = express();
const port = process.env.PORT || 9000;

app.use(express.static(__dirname))
app.get('/', (req, res) => res.sendFile('./services/index.html'));
app.use('/matchID',matchIDRouter);

app.listen(port, () => console.log('App listening on port ' + port))

module.exports = app;
const express = require('express')
const app = express()
const api = require('./routes/api');
const port = 3500

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json())

/* app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser()); */

app.use('/api',api)

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


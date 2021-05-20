const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.post('/', async (req, res) => {
    const body = req.body;
    // console.log(body.url);
    const info = await require('./lib/app').wpcheck(
        require('minimist')(
            body.url,
            require('./config/minimist.json')
        )
    );
    res.json(info);
})

app.listen(port, () => {
    console.log(`Wordpress Scanning app listening at http://localhost:${port}`)
})
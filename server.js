const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.post('/', async (req, res) => {
    const body = req.body;
    console.log(body.url);
    const finalRep = await require('./lib/app').wpcheck(
        require('minimist')(
            body.url,
            require('./config/minimist.json')
        )
    )//*/

    /*require('./lib/app').wpcheck(
        require('minimist')(
            body.url,
            require('./config/minimist.json')
        )
    ).then((res) => {
        console.log("final res",res);
    })//*/

    //   res.send('Hello World!')
    // console.log('FINAL', finalRep)
    res.json(finalRep);
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
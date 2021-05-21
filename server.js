const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080;

app.post('/', async (req, res) => {
    const body = req.body;
    console.log(body.url);
    let info  =  {
        "success": false,
        "error": ""
    };
    if (!body.auth || body.auth!='5CANW0RDPRE552022') {
        info.error="Auth is missing";        
    }
    else if (!body.url) {
        info.error="Url is missing";        
    }
    else {
        info = await require('./lib/app').wpcheck(
            require('minimist')(
                [body.url],
                require('./config/minimist.json')
            )
        );
    }
    res.json(info);
})

app.listen(port, () => {
    console.log(`Wordpress Scanning app listening at http://localhost:${port}`)
})
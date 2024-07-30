const express = require('express');
const cors = require('cors');
const { router } = require('./routers/router.js');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.use('/', express.static(__dirname + '/public/'));

app.listen(process.env.PORT || 3001, () => {
    console.log(`run on ${process.env.PORT || 3001}`);
});

app.use('/', router);


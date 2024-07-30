const knex = require('knex');
require('dotenv').config();

// console.log(process.env);

const {PGHOST, PGPORT, PGUSER, PGPASSWORD} = process.env;
const PGDB = 'ShapeControl';

const db = knex ({
    client: 'pg',
    connection: {
        host: PGHOST,
        port: PGPORT,
        user: PGUSER,
        database: PGDB,
        password: PGPASSWORD
    }
});

module.exports = {
    db
};
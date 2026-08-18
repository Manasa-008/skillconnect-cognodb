const neo4j = require("neo4j-driver");
require("dotenv").config();

const driver = neo4j.driver(
    process.env.COGNO_URI,
    neo4j.auth.basic(
        process.env.COGNO_USER,
        process.env.COGNO_PASSWORD
    )
);

module.exports = driver;
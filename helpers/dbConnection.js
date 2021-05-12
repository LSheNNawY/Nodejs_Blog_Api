require('dotenv').config()

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true});
const db = mongoose.connection;

db.once('open', () => console.log("connection created successfully"))
    .on('error', (error) => {
        console.log(error);
        process.exit(1);
    });

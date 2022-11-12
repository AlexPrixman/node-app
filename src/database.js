const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));
    
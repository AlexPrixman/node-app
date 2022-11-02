const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/notes-db-app')
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err));
    
const config = require('config');

const mongoose = require('mongoose');

//const db = config.get('mongoURI');
const db = "mongodb://127.0.0.1:27017/devConnector"

const connectDB = async() => {

    try {
        console.log("mongoDB - Inside Try"); 
        await mongoose.connect(db, {});
        /*await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: true
        });
        */
        console.log("mongoDB connected successfully");
    }
    catch (err) {
        console.log("mongoDB - Inside CatchError");
        console.log(err.message);
    }
}

module.exports = connectDB;

/*connectDB();
console.log('mongoURI' + db);
*/ 
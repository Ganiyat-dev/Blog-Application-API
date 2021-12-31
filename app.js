const express = require('express');
const app = express();
const morgan = require('morgan');
const connectDB = require('./db/connect')
const port = 5000;

require('dotenv').config()

// middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));


// routes
app.get('/home', (req, res) => {
    res.send('Welcome to my blog App!');
})

app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/post", require("./routes/posts"));


// Error middleware
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(err.status || 500).json({
        message: err.message
    });
});

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        console.log('Connected to Database');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
}
start();
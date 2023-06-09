const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")

// const middleware = require("./middleware");
const generateTokenMiddleware = require("./middleware");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000

/**
 * post request route
 * this route handle request from client side application to generate or initialize a meeting 
 */
// app.use("/generate", middleware.generate, (req, res) => {
    app.use("/generate", generateTokenMiddleware, (req, res) => {
    res.status(200).json(res.locals.signature)
    console.log("response to client: ")
})

// GLobal error handling
app.use((err, req, res, next) => {
    console.log(err)

    const defaultErr = {
        log: "unknown error occured",
        status: 500,
        message: {err: "error has occured"}
    };

    const errorObj = Object.assign({}, defaultErr, err);

    return res.status(errorObj.status).json(errorObj.message)
});

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
});

module.exports = app;
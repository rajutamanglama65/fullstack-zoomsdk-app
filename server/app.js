const express = require("express")
const dotenv = require("dotenv")

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 4000

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
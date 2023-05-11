const KJUR = require("jsrsasign") //cryptography library
require("dotenv").config();

const middleware = {}

// middleware.generateToken = (req, res, next) => {
    const generateTokenMiddleware = (req, res, next) => {
    try {
        let signature = "";
        const iat = Math.round(new Date().getTime() / 1000);
        const exp = iat + 60 * 60 * 2;

        const oHeader = {alg: "HS256", typ: "JWT"};

        // destracture request body which is from client-side to access user credentials
        const {topic, passWord, userIdentity, sessionKey, roleType} = req.body;
        const sdkKey = process.env.SDK_KEY;
        const sdksecret = process.env.SDK_SECRET;

        const oPayload = {
            app_key: sdkKey,
            iat,
            exp,
            tpc: topic,
            pwd: passWord,
            user_identity: userIdentity,
            session_key: sessionKey,
            role_type: roleType
        };

        const sHeader = JSON.stringify(oHeader);
        const sPayload = JSON.stringify(oPayload);
        signature = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, sdksecret);

        // save signature to res.locals object so that we can use it to respond back to client
        res.locals.signature = signature

        return next();
    } catch (error) {
        return next({error})
    }
}

// module.exports = middleware;
module.exports = generateTokenMiddleware;
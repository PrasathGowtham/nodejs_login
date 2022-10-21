const mongo = require("../connect");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.createrooms = async (req, res) => {
    try {
        const existuser = await mongo.selectedDb.collection("users").findOne({ email: req.body.email });
        if (existuser) return res.status(500).send({ msg: "You are already a registered User" })

        const issamepassword = checkpassword(
            req.body.password, req.body.confirmpassword);
        if (!issamepassword) {
            return res.status(400).send({ msg: "password dosint match" })
        } else {
            delete req.body.confirmpassword
        };

        const randomstring = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, randomstring);

        const insetedresponce = await mongo.selectedDb.collection("users").insertOne({ ...req.body });
        res.send(insetedresponce);
    } catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
};

const checkpassword = (password, confirmpassword) => {
    return password !== confirmpassword ? false : true;
};


exports.signin = async (req, res) => {
    const existUser = await mongo.selectedDb.collection('users').findOne({ email: req.body.email })
    if (!existUser) { return res.status(500).send({ msg: "You are not a registered user" }) }

    const issamePassword = await bcrypt.compare(req.body.password, existUser.password);

    if (!issamePassword) {
        return res.status(400).send({
            msg: "incorrect password"
        })
    }
    const token = jwt.sign(existUser, process.env.SECRET_KEY, {
        expiresIn: "5m",
    })
    res.send(token);

};


exports.saveprofile = async (req, res) => {
try {
    const existuser = await mongo.selectedDb.collection("profile").findOne({ email: req.body.email });
    if (existuser) return res.status(500).send({ msg: "You are already a registered User" })

    const insetedresponce = await mongo.selectedDb.collection("profile").insertOne({ ...req.body });
    res.send(insetedresponce);
} catch (err) {
    console.log(err)
    res.status(500).send(err)
}};

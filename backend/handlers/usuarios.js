const { db, admin } = require("../util/admin");

exports.get_usuario = async (req, res) => {
    try {
        admin.auth()
        .getUser(req.params.idusr)
        .then((userRecord) => {
            console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
            res.json(userRecord)
        })
        .catch((error) => {
            console.log('Error fetching user data:', error);
            res.json(error)
        });
    }
    catch(error) {
        return res
        .status(500)
        .json({ general: "Something went wrong, please try again"});          
    }
    
}

exports.post_usuario = async (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
        emailVerified: false,
        disabled: false
    }
    const userResponse = await admin.auth().createUser({
        email: user.email,
        password: user.password,
        emailVerified: false,
        disabled: false
    })
    res.json(userResponse)
}

exports.update_usuario = async (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
        emailVerified: false,
        disabled: false
    }
    const userResponse = await admin.auth().updateUser(req.params.idusr, {
        email: user.email,
        password: user.password,
        emailVerified: false,
        disabled: false
    })
    res.json(userResponse)
}

exports.delete_usuario = async (req, res) => {

    const userResponse = await admin.auth().deleteUser(req.params.idusr)
    res.json(userResponse)
}
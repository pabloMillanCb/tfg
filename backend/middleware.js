const admin = require('./util/admin').admin;
const { db } = require("./util/admin");

class Authentication {
    async decodeToken(req, res, next) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			console.log(token)
			const decodeValue = await admin.auth().verifyIdToken(token);
			if (decodeValue) {
				req.user = decodeValue;
				console.log("Exito decode")
				return next();
			}
			console.log("Fracaso decode")
			return res.json({ message: 'Un authorize' });
		} catch (e) {
			console.log("Error decode")

			return res.json({ message: 'Internal Error' });
		}
	}

	async verifyUser(req) {
		const scene =await db.collection('escenas').doc('/' + req.params.id + '/')
		const uid = scene.uid
		const token = req.headers.authorization.split(' ')[1];
		const decodeValue = await admin.auth().verifyIdToken(token);
		return decodeValue.user_id == uid
	}
}

module.exports = new Authentication
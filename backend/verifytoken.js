const admin = require('./util/admin').admin;

class Authentication {
    async decodeToken(req, res, next) {
		try {
			const token = req.headers.authorization.split(' ')[1];
			console.log(token)
			const decodeValue = await admin.auth().verifyIdToken(token);
			if (decodeValue) {
				req.user = decodeValue;
				return next();
			}
			return res.json({ message: 'Un authorize' });
		} catch (e) {
			return res.json({ message: 'Internal Error' });
		}
	}
}

module.exports = new Authentication
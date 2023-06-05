const { db } = require("../util/admin");

exports.get_escenas = async (req, res) => {
    const escenasRef = db.collection('escenas');    
        try{
            if (req.params.idusr == undefined) {
                escenasRef.get().then((snapshot) => {
                    const data = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));            
                    console.log(data);
                    return res.status(201).json(data);
                })
            }
            else {
                escenasRef.where('user', '==', req.params.idusr).get().then((snapshot) => {
                    const data = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));            
                    console.log(data);
                    return res.status(201).json(data);
                })
            }
            
    } catch (error) {
        return res
        .status(500)
        .json({ general: "Something went wrong, please try again"});          
    }
}

exports.post_escena = async (req, res) => {
    try {
        await db.collection('escenas').add(req.body);
        return res.status(201).send()
          
    } catch (err){
        console.log(err);
        return res.status(522).send(err);
    }
}

exports.update_escena = async (req, res) => {
    try {
        await db.collection('escenas').doc('/' + req.params.id + '/')
        .update(req.body)
        return res.status(201).send()
          
    } catch (err){
        console.log(err);
        return res.status(522).send(err);
    }
}

exports.delete_escena = async (req, res) => {
    try {
        await db.collection('escenas').doc('/' + req.params.id + '/')
        .delete()
        return res.status(201).send()
          
    } catch (err){
        console.log(err);
        return res.status(522).send(err);
    }
}
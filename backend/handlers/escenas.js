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
                escenasRef.where('uid', '==', req.params.idusr).get().then((snapshot) => {
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
        const id = db.collection('escenas').doc().id
        const scene = req.body
        
        scene.model_url = "models/"+id+".glb"

        if (scene.audio != "")
        {
            scene.audio = "audio/"+id+'.mp3'
        }

        if (scene.image_url != "")
        {
            scene.image_url = "images/"+id+'.jpg'
        }

        console.log(id)
        await db.collection('escenas').doc('/' + id + '/').set(scene)
        return res.status(201).json({idscene: id}).send()
          
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
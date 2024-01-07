import Dev from '../models/programuotojas.js'


const handleErrors = (err) => {
    let errors = {vardas: '', tech: '', laisvas: '', location: ''}
    if(err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}

export const prog_get = (req, res) => {
    const lng = parseFloat(req.query.lng)
    const lat = parseFloat(req.query.lat)

    console.log('Parsed Coordinates:', lng, lat)

    Dev.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng, lat],
                },
                distanceField: 'distance',
                spherical: true,
                maxDistance: 100000, // in meters (100km)
            },
        },
    ])
        .then(devs => {
            console.log('Found Developers:', devs)
            res.send(devs)
        })
        .catch(error => {
            console.error('Error:', error)
            res.status(500).send(error.message)
        })
}

export const prog_post = async (req, res) => {
    const {vardas, tech, laisvas, location} = req.body 
    try {
        const dev = await Dev.create({vardas, tech, laisvas, location})
        res.status(200).json({dev: dev._id})
    } catch(err) {
        const errors = handleErrors(err)
        res.status(400).json({errors})
    }
}

export const prog_put = async (req, res) => {
    try {
        const updatedDev = await Dev.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updatedDev) {
            return res.status(404).json({ error: 'Programuotojas nerastas' })
        }
        const foundDev = await Dev.findOne({ _id: req.params.id })
        if (!foundDev) {
            return res.status(404).json({ error: 'Programuotojas nerastas' })
        }
        res.json(foundDev)
    } catch (err) {
        console.error(err)
        const errors = handleErrors(err)
        res.status(500).json({errors})
    }
}

export const prog_delete = async (req, res) => {
    try {
        const deletedDev = await Dev.findByIdAndDelete(req.params.id)
        if (!deletedDev) {
            return res.status(404).json({ error: 'Programuotojas nerastas' })
        }
        res.json({ message: 'Programuotojas ištrintas sėkmingai', deletedDev })
    } catch (err) {
        console.error(err)
        const errors = handleErrors(err)
        res.status(500).json({errors})
    }
}

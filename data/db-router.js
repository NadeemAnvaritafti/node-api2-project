const express = require('express');

const db = require('./db');

const router = express.Router();

router.use(express.json());


// GET request for all posts
router.get('/', (req, res) => {
    db.find()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(error => {
        console.log('error on GET /api/posts', error);
        res.status(500).json({ error: 'The posts information could not be retrieved.' })
    })
})

// GET request for specific user 
router.get('/:id', (req, res) => {
    const id = req.params.id;
        db.findById(id) 
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'The user with the specified ID does not exist' })
            }
        })
        .catch(error => {
            console.log('error on GET /api/users/:id', error);
            res.status(500).json({ error: 'The user information could not be retrieved.' })
        })  
}) 

// POST request for adding a user
router.post('/', (req, res) => {
    const usersData = req.body;
    if (!usersData.name || !usersData.bio) {
            res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' })
        } else {
            db.insert(usersData)    
            .then(user => {
                res.status(201).json(user);
            })
            .catch(error => {
                console.log('error on POST /api/users', error);
                res.status(500).json({ error: 'There was an error while saving the user to the database' })
            })
        }
})

// DELETE request for removing a user
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id)
    .then(removed => {
        if (removed) {
            res.status(200).json({ message: 'user removed successfully', removed })   
        } else {
            res.status(404).json({ message: 'The user with the specified ID does not exist.' })
        }
    })
    .catch(error => {
        console.log('error on DELETE /api/users/:id', error);
        res.status(500).json({ error: 'The user could not be removed' })
    })
})

// PUT request for editing a user
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const usersData = req.body;
    
    db.findById(id) 
        .then(user => {
            if (!user) {
                res.status(404).json({ message: 'The user with the specified ID does not exist' })
            }
        })
        .catch(error => {
            console.log('error on finding specific ID /api/users/:id', error);
            res.status(500).json({ error: 'The user information could not be retrieved.' })
        }) 

    if (!usersData.name || !usersData.bio) {
        res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' })
    }  else {
        db.update(id, usersData)
        .then(user => {
            res.status(200).json({ message: `user ${id} was updated` });
        })
        .catch(error => {
            console.log('error on PUT /api/users/:id', error);
            res.status(500).json({ error: 'The user information could not be modified.' })
        })
    }
})



module.exports = router;
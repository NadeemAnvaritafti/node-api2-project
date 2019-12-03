const express = require('express');

const db = require('./db');

const router = express.Router();

router.use(express.json());


// ----------------------------------------- GET -------------------------------------------- //

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

// GET request for specific post by id 
router.get('/:id', (req, res) => {
    const id = req.params.id;
        db.findById(id) 
        .then(post => {
            if (post[0]) {
                res.status(200).json(post[0]);
            } else {
                res.status(404).json({ message: 'The post with the specified ID does not exist' })
            }
        })
        .catch(error => {
            console.log('error on GET /api/posts/:id', error);
            res.status(500).json({ error: 'The post information could not be retrieved.' })
        })        
}) 

// GET request for all comments on a specific post 
router.get('/:id/comments', (req, res) => {
    const id = req.params.id;
        db.findById(id) 
        .then(post => {
            if (!post[0]) {
                res.status(404).json({ message: 'The post with the specified ID does not exist' })
            }
        })
        .catch(error => {
            console.log('error on GET /api/posts/:id', error);
            res.status(500).json({ error: 'The post information could not be retrieved.' })
        })
        db.findPostComments(id)
        .then(comments => {
            res.status(200).json(comments);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: 'The comments information could not be retrieved.' })
        })        
})

// -------------------------------------- POST -------------------------------------------- //

// POST request for adding a post
router.post('/', (req, res) => {
    const postData = req.body;
    if (!postData.title || !postData.contents) {
            res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' })
        } else {
            db.insert(postData)    
            .then(post => {
                res.status(201).json({ success: `post was successfully added`});
            })
            .catch(error => {
                console.log('error on POST /api/posts', error);
                res.status(500).json({ error: 'There was an error while saving the post to the database' })
            })
        }
})

// POST request for adding a comment to a specific post
router.post('/:id/comments', (req, res) => {
    const commentData = req.body;
    const id = req.params.id;
        db.findById(id) 
        .then(post => {
            if (!post[0]) {
                res.status(404).json({ message: 'The post with the specified ID does not exist' })
            }
        })
        .catch(error => {
            console.log('error on GET /api/posts/:id', error);
            res.status(500).json({ error: 'The post information could not be retrieved.' })
        })
        if (!commentData.text) {
            res.status(400).json({ errorMessage: 'Please provide text for the comment.' })
        } else {
            db.insertComment(commentData)    
            .then(comment => {
                res.status(201).json(comment);
            })
            .catch(error => {
                console.log('error on POST /api/posts/:id/comments', error);
                res.status(500).json({ error: 'There was an error while saving the comment to the database' })
            })
        }
})

// --------------------------------------- DELETE ----------------------------------------- //

// DELETE request for removing a post
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id)
    .then(removed => {
        if (removed) {
            res.status(200).json({ message: 'post removed successfully', removed })   
        } else {
            res.status(404).json({ message: 'The post with the specified ID does not exist.' })
        }
    })
    .catch(error => {
        console.log('error on DELETE /api/posts/:id', error);
        res.status(500).json({ error: 'The post could not be removed' })
    })
})

// -------------------------------------- PUT --------------------------------------------- //

// PUT request for editing a post
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const postData = req.body;
    
    db.findById(id) 
        .then(post => {
            if (!post[0]) {
                res.status(404).json({ message: 'The post with the specified ID does not exist' })
            }
        })
        .catch(error => {
            console.log('error on finding specific ID /api/posts/:id', error);
            res.status(500).json({ error: 'The post information could not be retrieved.' })
        }) 

    if (!postData.title || !postData.contents) {
        res.status(400).json({ errorMessage: 'Please provide title and contents for the post.' })
    }  else {
        db.update(id, postData)
        .then(post => {
            res.status(200).json({ message: `post ${id} was updated` });
        })
        .catch(error => {
            console.log('error on PUT /api/posts/:id', error);
            res.status(500).json({ error: 'The post information could not be modified.' })
        })
    }
})



module.exports = router;
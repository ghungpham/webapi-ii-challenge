const db = require('../data/db.js');

const router = require('express').Router();

const sendUserError = (status, message, res) => {
    res.status(status).json({errorMessage: message});
    return;
}

router.post('/',  (req, res) => {
   const { title, contents, created_at, updated_at } = req.body
    if ( !title || !contents) {
        sendUserError(400,
         "Please provide title and contents for post.", 
            res);
         return;
    }
    db
        .insert({
            title,
            contents,
            created_at,
            updated_at
        })
        .then(post => {
            res.status(201).json({success: true, post });
        })
        .catch(error => {
            console.log(error);
            sendUserError(500, 
                "There was an error while saving the post to the database",
                    res)
            return;
        });
});

router.post('/:id/comments', (req, res) => {
    const { id } = req.params;
    const { text, post_id, created_at, updated_at  } = req.body;
    if (!text){
        sendUserError(400, "Please provide text for the comment.",
        res)
    }
    db
        .insertComment({
            text,
            // post_id,
            // created_at,
            // updated_at
        })
        .then(response => { 
            if (response == 0 ){sendUserError(404, "The post with the specified ID does not exist.", 
            res)
            return;
            }
            
            db 
            .findById(id)
            .then(post => {
                if (post.length ===0) {
                    sendUserError(404, "The post with the specified ID does not exist.", 
                res)
                return;
                }
                res.status(201).json(comment)
            })
        })
        .catch(error => {
            console.log(error)
            sendUserError(500, "There was an error while saving the comment to the database",
             res)
            return;
        });

})

router.get('/', (req, res) => {
    db
    .find()
    .then(posts => {
        res.status(200).json({ success: true, posts });
    })
    .catch(error => {
        console.log(error)
        sendUserError(500, "The posts information could not be retrieved.", 
        res)
        return;
    });
});

router.get('/:id', (req,res) => {
    const { id } = req.params;

    db
    .findById(id)
    .then(post => {
        if (post.length === 0) {
            sendUserError(404, "The post with the specified ID does not exist." ,
            res)
            return;
        }
        res.status(200).json({ success: true, post });   
    })
    .catch(error => {
        console.log(error)
        sendUserError(500, "The post information could not be retrieved.", 
        res)
    })
})

router.get('/:id/comments', (req, res) => {
    const { postId } = req.params;
    
    db
    .findPostComments(postId)
    .then(comments => {
        if (comments.length === 0) {
            sendUserError(404, "The post with the specified ID does not exist.", 
            res)
            return;
        }
        res.status(200).json({success: true, comments })
    })
    .catch(error => {
        console.log(error)
        sendUserError(500, "The comments information could not be retrieved.", 
        res)
    })
})

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db
    .remove(id)
    .then( response => {
        if (response === 0) {
            sendUserError(404, "The post with the specified ID does not exist.", 
            res)
            return;
        }
        res.json({success: `Post was deleted`})
    })
    .catch(error => {
        console.log(error)
        sendUserError(500, "The post could not be removed",
        res)
    })
})

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, contents, created_at, updated_at } = req.body

    if ( !title || !contents) {
        sendUserError(400,
         "Please provide title and contents for post.", 
            res);
         return;
        }
    
    db
    .update(id, {
        title,
        contents,
        // created_at,
        // updated_at
    })
    .then( response => {
        if (response == 0){
            sendUserError(404, "The post with the specified ID does not exist.", 
            res)
            return;
        }

        db
        .findById(id)
        .then(post => {
            if (post.length ===0) {
                sendUserError(404, "The post with the specified ID does not exist.", 
            res)
            return;
            }
            res.status(200).json(post)
        })
    })
    .catch( error => {
        console.log(error)
        sendUserError( 500, "The post information could not be modified.", 
        res)
        return;
     })
})
    


module.exports = router;
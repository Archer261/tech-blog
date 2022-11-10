// const router = require('express').Router();
// const { Post } = require('../../models');

// router.post('/', async (req, res) => {
//     try {
//         const newPost = await Post.create({
//             ...req.body,
//             Post_id: req.session.user_id,
//         });

//         res.status(200).json(newPost);
//     } catch (err) {
//         res.status(400).json(err);
//     }
// });

// router.delete('/:id', async (req, res) => {
//     try {
//         const postData = await Post.destroy({
//             where: {
//                 id: req.params.id,
//                 user_id: req.session.user_id,
//             },
//         });

//         if (!postData) {
//             res.status(404).json({ message: 'No post found with this id!' });
//             return;
//         }

//         res.status(200).json(postData);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

// module.exports = router;


const router = require('express').Router();
const { Post } = require('../../models');

router.post('/login', async (req, res) => {
    try {

        const PostData = await Post.findOne({ where: { email: req.body.email } });

        if (!PostData) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }


        const validPassword = await PostData.checkPassword(req.body.password);

        if (!validPassword) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }


        req.session.save(() => {
            req.session.Post_id = PostData.id;
            req.session.logged_in = true;

            res.json({ Post: PostData, message: 'You are now logged in!' });
        });

    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {

        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;
const router = require('express').Router();
const Post = require('../models/Post');

router.get('', (req, res) => {
    Post.find()
    .then(data => {
        res.render('./pages/home', { array: data });
    })
    .catch(err => {
        console.log(err);
    })
});

router.get('/post/:id', (req, res) => {
    const id = req.params.id;
    Post.findById({ _id: id})
    .then(data => {
        res.render('./pages/post', { post: data });
    })
    .catch(err => {
        console.log(err);
    })
});

router.post('/search', (req, res) => {
    const search = req.body.q;
    const searchNospecialchars = search.replace(/[^a-zA-Z0-9]/g, '');
    Post.find({
        $or: [
            {title: {$regex: new RegExp(searchNospecialchars, 'i')}},
            {body: {$regex: new RegExp(searchNospecialchars, 'i')}}
        ]
    })
    .then(data => {
        res.render('./pages/search', { array: data });
    })
})

router.get('/login', (req, res) => {
    res.render('./pages/login');
})

router.get('/about', (req, res) => {
    res.render('./pages/about');
})

router.get('/contact', (req, res) => {
    res.render('./pages/contact');
})

module.exports = router;
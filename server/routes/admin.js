const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = 'layouts/adminLayout';
const jwtSecret = process.env.JWT_SECRET;

const authMiddleWare = (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        res.json({ message: 'Unauthorized'});
    }

    try{
        const decode = jwt.verify(token, jwtSecret);
        req.userID = decode.userID;
        next();
    }
    catch(err){
        console.log(err);
    }
}

router.get('/', (req, res) => {
    res.render('./admin/home', {layout: adminLayout});
});

router.get('/dashboard', authMiddleWare, async (req, res) => {
    try{
        const data = await Post.find();
        res.render('./admin/dashboard', { data: data, layout: adminLayout });
    }
    catch(err){
        console.log(err);
    }
})

router.post('/login', async (req, res) => {
    try{
        const {username, password} = req.body;
        const user = await User.findOne({ username });
        
        if(!user){
            return res.json({message: 'invalid'});
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if(!isPasswordValid){
            return res.json({message: 'invalid'});
        }
        
        const token = jwt.sign({userID: user._id}, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        
        res.redirect('./dashboard');
    }
    catch(err){
        console.log(err);
    }
});

router.get('/post/new', authMiddleWare, (req, res) => {
    res.render('./admin/addPost', {layout: adminLayout});
})

router.post('/post/new', authMiddleWare, (req, res) => {
    const post = new Post(req.body);
    post.save()
        .then(() => {
            res.redirect('../dashboard');
        })
})

// router.post('/register', (req, res) => {
//     const {username, password} = req.body;

//     bcrypt.hash(password, 10)
//         .then(hashed => {
//             const user = new User({username, password: hashed});
//             user.save()
//                 .then(() => {
//                     res.json({user});
//                 })
//         })
//         .catch(err => console.log(err))

// })
module.exports = router;
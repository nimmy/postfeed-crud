/**
 * @description THIS APPLICATION IS JUST FOR DEMO. USER IMPLIMENTATION IS SAME LIKE WE HAVE STORED THE POST DATA
 */

const express = require('express');
const engine = require('express-edge');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUploader = require('express-fileupload');
const Post = require('./database/models/Post');

const path = require('path');
const DB_CONNECT = 'mongodb+srv://nimeshmehra:nodeexpress@nodeexpress.n5p8xb7.mongodb.net/test';

const app = express();
app.use(engine);
app.use(express.static('public'));
app.set('views', `${__dirname}/views`);
app.use(bodyParser.json());
app.use(fileUploader());

app.use(bodyParser.urlencoded({extended: true}));

// This is they we can create data in the dataase without any UI
// Reference Doc link: https://mongoosejs.com/docs/models.html
// Post.create({
//     title: 'First Blog',
//     description: 'Details about this blog',
//     content: 'Blog is ready'
// });


// This is they we can read data in the dataase without any UI
// const item = Post.find({});
// item.then(data => console.log(data))
// .catch(err => console.log(err));



const connectParams = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}
mongoose.connect(DB_CONNECT, connectParams)
.then((data) => {
    console.log('Connected');
})
.catch((err) => {
    console.log('Error');
});


// All Routes with express

/*
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/about.html'));
})

app.get('/contact', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/contact.html'));
})

app.get('/post', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/post.html'));
})
*/

app.get('/', async (req, res) => {
    const posts = await Post.find({});
    console.log(posts);
    res.render('index', {
        posts : posts
    });
});

app.get('/create/new', (req, res) => {
    res.render('create');
});

app.get('/about', (req, res) => {
    res.render('about');
})

app.get('/contact', (req, res) => {
    res.render('contact');
})

app.get('/post/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);
    console.log(req.params.id);
    res.render('post', {
        post: post
    });
    // res.render('post');
})

app.post('/post/store', (req, res) => {
    console.log(req.body);
    const {image} = req.files;
    image.mv(path.resolve(__dirname, "public/posts", image.name), (err) => {
        // Post Created
        console.log(err);
        Post.create({
            ...req.body,
            image: `/posts/${image.name}`
        });
        res.redirect('/');
    });
})

app.listen(4000, () => {
    console.log('Working with Node server');
})
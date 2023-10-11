const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const express = require('express');
const blogData = require("./blog-service");
const path = require("path");
const app = express();


cloudinary.config({
    cloud_name: 'dzwjwdmmm',
    api_key: '298311492371866',
    api_secret: '8X4eHQSRZv3ZgXvr2OtuOKAoH9E',
    secure: true
});
	const upload = multer(); 

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect("/about");
});

app.get('/posts/add', (req, res) => {
    res.sendFile(path.join(__dirname, "/views/addPost.html"))
});

app.post('/posts/add', upload.single("featureImage"), (req, res) => {
    let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
                (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
                }
            );
    
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };
    
    async function upload(req) {
        let result = await streamUpload(req);
        console.log(result);
        return result;
    }
    
    upload(req).then(async (uploaded)=>{
        req.body.featureImage = uploaded.url;
    
        // TODO: Process the req.body and add it as a new Blog Post before redirecting to /posts
        try {
            // Call the addPost function to add the new blog post
            const newPost = await blogService.addPost(req.body);
    
            // Redirect the user to the /posts route after adding the post
            res.redirect('/posts');
          } catch (error) {
            // Handle any errors here
            res.status(500).send('Error adding post: ' + error.message);
          }
    });
    
    
});


app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"))
});

app.get('/blog', (req,res)=>{
    blogData.getPublishedPosts().then((data=>{
        res.json(data);
    })).catch(err=>{
        res.json({message: err});
    });
});

app.get('/posts', (req,res)=>{
    const { category, minDate } = req.query;
  if (category) {
    blogService
      .getPostsByCategory(category)
      .then((data) => {
        res.json(data);
      })
      .catch(function (err) {
        console.log("Unable to fetch posts by category: " + err);
        res.status(500).send('Internal Server Error');
      });
  } else if (minDate) {
    blogService
      .getPostsByMinDate(minDate) 
      .then((data) => {
        res.json(data);
      })
      .catch(function (err) {
        console.log("Unable to fetch posts by minDate: " + err);
        res.status(500).send('Internal Server Error');
      });
  } else {
    blogService
      .getAllPosts()
      .then((data) => {
        res.json(data);
      })
      .catch(function (err) {
        console.log("Unable to open the file: " + err);
        res.status(500).send('Internal Server Error');
      });
  }
});

  

app.get('/categories', (req,res)=>{
    blogData.getCategories().then((data=>{
        res.json(data);
    })).catch(err=>{
        res.json({message: err});
    });
});

app.use((req,res)=>{
    res.status(404).send("404 - Page Not Found")
})

blogData.initialize().then(()=>{
    app.listen(HTTP_PORT, () => { 
        console.log('server listening on: ' + HTTP_PORT); 
    });
}).catch((err)=>{
    console.log(err);
})





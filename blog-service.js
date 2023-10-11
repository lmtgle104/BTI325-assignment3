const fs = require("fs");

let posts = [];
let categories = [];


function getPostsByCategory(category) {
    return new Promise((resolve, reject) => {
      const allposts = posts.filter(post => post.category === category);
      if (allposts.length > 0) {
        resolve(posts);
      } else {
        reject("No results returned");
      }
    });
  }

  function getPostsByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
      const minDate = new Date(minDateStr);
      const allposts = posts.filter(post => new Date(post.postDate) >= minDate);
      if (allposts.length > 0) {
        resolve(allposts);
      } else {
        reject("No results returned");
      }
    });
}

function getPostById(id) {  
    return new Promise((resolve, reject) => {
      const allpost = posts.find(post => post.id === id);
      if (allpost) {
        resolve(allpost);
      } else {
        reject("No result returned");
      }
    });
  }


function addPost(postData) {
    return new Promise((resolve, reject) => {
      // If postData.published is undefined, set it to false; otherwise, set it to true
      postData.published = postData.published === undefined ? false : true;
  
      // Set the id property of postData to the length of the "posts" array plus one
      postData.id = posts.length + 1;
  
      // Push the updated postData object onto the "posts" array
      posts.push(postData);
  
      // Resolve the promise with the updated postData
      resolve(postData);
    });
  }
module.exports = {
    addPost,
};

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/posts.json', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                posts = JSON.parse(data);

                fs.readFile('./data/categories.json', 'utf8', (err, data) => {
                    if (err) {
                        reject(err);
                    } else {
                        categories = JSON.parse(data);
                        resolve();
                    }
                });
            }
        });
    });
}

module.exports.getAllPosts = function(){
    return new Promise((resolve,reject)=>{
        (posts.length > 0 ) ? resolve(posts) : reject("no results returned"); 
    });
}

module.exports.getPublishedPosts = function(){
    return new Promise((resolve,reject)=>{
        (posts.length > 0) ? resolve(posts.filter(post => post.published)) : reject("no results returned");
    });
}

module.exports.getCategories = function(){
    return new Promise((resolve,reject)=>{
        (categories.length > 0 ) ? resolve(categories) : reject("no results returned"); 
    });
}
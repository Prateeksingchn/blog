var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require('./multer');

// use this line to run passport
passport.use(new localStrategy(userModel.authenticate()));

// "1"
router.get('/', function(req, res, next) {
  res.render('index', {nav: false});
});

// "2"
router.get('/register', function(req, res, next) {
  res.render('register', {nav: false});
});


// "7"
router.get('/profile', isLoggedIn, async function(req, res, next) {
  const user = 
  await userModel
        .findOne({username: req.session.passport.user})
        .populate("posts")
        await console.log(user);
  res.render('profile', {user, nav: true});
});




// "8"
// pencil icon se file upload karwa rahe hai
router.post('/fileupload', isLoggedIn, upload.single("image"), async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  user.profileImage = req.file.filename;
  await user.save();  
  res.redirect("/profile");
}); 


// "9"
// for adding new posts
router.get('/add', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  res.render('add', {user, nav: true});
});



// "10"
/* After clicking on "Add new posts" a new page will pop-up and then, after you createpost, 
it will redirect you using this route and isko use karne ke liye we have to make post model */
router.post('/createpost', isLoggedIn, upload.single("postimage"), async function(req, res, next) {
  try {
    const user = await userModel.findOne({username: req.session.passport.user});
    
    if (!user) {
      return res.status(404).send("User not found");
    }

    const post = await postModel.create({
      user: user._id,
      title: req.body.title,
      description: req.body.description,
      image: req.file.filename
    });

    if (!post) {
      return res.status(500).send("Failed to create post");
    }
``
    user.posts.push(post._id);
    await user.save();

    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


// "11"
router.get('/show/posts', isLoggedIn, async function(req, res, next) {
  const user = 
  await userModel
        .findOne({username: req.session.passport.user})
        .populate("posts")
  res.render('show', {user, nav: true});
});


// "12"
router.get('/feed', isLoggedIn, async function(req, res, next) {
  const user = await userModel.findOne({username: req.session.passport.user});
  const posts = await postModel.find().populate("user");
  res.render('feed', {user, posts, nav: true});
});
router.post('/login', passport.authenticate("local", {
  failureRedirect: "/",
  successRedirect: "/feed"
}));


// "13"
// This is for opening a single post on different page
router.get('/open/posts/:postid', isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel
      .findOne({ username: req.session.passport.user })
      .populate("posts");

      let post = await postModel.findOne({_id: req.params.postid});
      

    if (!post) {
      const error = new Error('Post not found');
      error.status = 404;
      throw error;
    }

    res.render('open', { user, post, nav: true });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).render('error', { message: error.message, error, nav: true });
  }
});



// "14"
router.get('/profile/post/:postid', isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel
      .findOne({ username: req.session.passport.user })
      .populate("posts");

    let post = await postModel.findOne({ _id: req.params.postid });

    if (!post) {
      const error = new Error('Post not found');
      error.status = 404;
      throw error;
    }

    res.render('open', { user, post, nav: true });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).render('error', { message: error.message, error, nav: true });
  }
});




// Delete post route
router.delete('/delete/post/:postId', async (req, res) => {
  try {
    const response = await fetch(`/delete/post/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      } else {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }
    }
  
    // Handle successful deletion
  } catch (err) {
    console.error('Error deleting post:', err);
    alert('An error occurred while deleting the post. Please try again.');
  }
});

// Edit post route (for rendering the edit form)
router.get('/edit/post/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).render('error', { message: 'Post not found' });
    }
    res.render('editPost', { post }); // Render the 'editPost' view with the post data
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Failed to fetch post' });
  }
});

// Update post route (for handling the form submission)
router.post('/update/post/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const { title, description, imageUrl } = req.body;
    
    const updatedPost = await Post.findByIdAndUpdate(postId, 
      { title, description, image: imageUrl || req.file?.filename },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.redirect(`/profile/post/${postId}`); // Redirect to the updated post page
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update post' });
  }
});




//--------------------------------------------------------------------------------------------------------------------------------------------------

// "3"
// iske through login honge(isme /profile diya hai, means login hone ke baad /profile pe jayega)
router.post('/register', function(req, res, next) {
  const data = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname: req.body.fullname,
    contact: req.body.contact
  })

  userModel.register(data, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect("/profile");
    })
  })
});


// "4"
// login se /profile pe jayega -------------------------------------------
router.post('/login', passport.authenticate("local", {
  failureRedirect: "/",
  successRedirect: "/profile",
}), function(req, res, next) {
});


// "5"
// logout ---------------------------------------------------------------
router.get("/logout", function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})


// "6"
// loggedIn(if loogedIn then return to 'next', or else redirec to '/')------
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}


// ----------------------------------------------------------------------------------------------------------------------------------
router.get("/edit", isLoggedIn, async function (req, res) {
  const user = await userModel.findOne({ username: req.session.passport.user });
  res.render("edit", { footer: true, nav: true, user });
});


router.get("/upload", isLoggedIn, async function (req, res) {
  let user = await userModel.findOne({ username: req.session.passport.user });
  res.render("upload", { footer: true, user });
});

router.post("/update", isLoggedIn, async function (req, res) {
  const user = await userModel.findOneAndUpdate(
    { username: req.session.passport.user },
    {
      username: req.body.username,
      fullname: req.body.fullname, // Add this line to update the fullname field
      bio: req.body.bio
    },
    { new: true }
  );
  req.login(user, function (err) {
    if (err) throw err;
    res.redirect("/profile");
  });
});




module.exports = router;

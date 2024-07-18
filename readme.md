/ - login and register screen
/register
/login
/profile - profile page with boards
/feed - feed page with all different pins
/save/:pinid - save pin
/delete/:pinid - save pin
/logout
/edit
/upload

-----------------------------------------------------------------------------------------------------------------------------------
# how to create app
1. express blog --view=ejs

2. npm install

3. open app in vs code
   code .

4. Create login and register page, make it working, then clear everything inn terminal then run these command

5. npm i mongoose passport passport-local passport-local-mongoose express-session

6. remove everything in user.js file in routes
And write this- 
const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/blog")


7. how multer installed-
   npm i multer uuid


-----------------------------------------------------------------------------------------------------------------------------------
# bg-iamge
bg img
bg-[url()]

bg-img src
src="/sarah-dayan.jpg"

-----------------------------------------------------------------------------------------------------------------------------------

# passport-logout code
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });


-----------------------------------------------------------------------------------------------------------------------------------
* How pencil icon works-
ek form banaya jiisse hidden kiya and form ko and pencil icon ko naam diya 
and then js likha profile.ejs mein hi, ki jab pencil pe click karege then open input of form

-----------------------------------------------------------------------------------------------------------------------------------
* Default code for multer-
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
        const unique = uuidv4();
      cb(null, unique + path.extname(file.originalname));
    }
})
  
const upload = multer({ storage: storage })

-----------------------------------------------------------------------------------------------------------------------------------



-----------------------------------------------------------------------------------------------------------------------------------


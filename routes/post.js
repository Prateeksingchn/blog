/* In this we do not requie plm and mongoose like user model, cozz ek baar hi connect karna hota hai */

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  title: String,
  description: String,
  image: String,
});



module.exports = mongoose.model('post', postSchema);

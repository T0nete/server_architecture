const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    title: {
      type: String,
      required: true,
      minlength: 5,
    },
    text: {
      type: String,
      required: true,
      minlength: 5,
    },
    author: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v
        return ret
      },
    },
  }
)

const Post = mongoose.model('Post', postSchema)
module.exports = Post

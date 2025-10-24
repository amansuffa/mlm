import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }]
}, {
  timestamps: true
});

// Create indexes for better performance
commentSchema.index({ blogId: 1, createdAt: -1 });
commentSchema.index({ parentId: 1 });

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
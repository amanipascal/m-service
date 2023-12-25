const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the TodoItem schema
const TodoSchema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, {
  toJSON: {
    transform(doc, ret){
        delete ret.__v;
    }
  },
  timestamps: true
});


module.exports = mongoose.model('Todo', TodoSchema);
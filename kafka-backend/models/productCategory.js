'use strict';
var mongoose = require('mongoose');

const ProductCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
},
{
  timestamps: true
});

module.exports = mongoose.model.ProductCategory || mongoose.model('ProductCategory', ProductCategorySchema);
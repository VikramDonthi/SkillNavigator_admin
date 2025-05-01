const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  sector: {
    type: String,
    required: true
  },
  requiredSkills: {
    type: [String],
    required: true
  },
  companies: {
    type: [String],
    required: true
  },
  employabilityScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  recruitmentProcess: {
    type: [String],
    required: true
  }
});

module.exports = mongoose.model('Job', jobSchema);
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Course = require('../models/courseModel.js');

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }
  next();
};

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err.message);
    res.status(500).json({ message: 'Server error while fetching courses' });
  }
});

router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (err) {
    console.error('Error fetching course:', err.message);
    res.status(500).json({ message: 'Server error while fetching the course' });
  }
});

router.post('/', async (req, res) => {
  const { name, category, amount } = req.body;

  if (!name || !category || amount == null || amount < 0) {
    return res.status(400).json({ message: 'Invalid input: name, category, and amount are required' });
  }

  const course = new Course({ name, category, amount });

  try {
    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (err) {
    console.error('Error creating course:', err.message);
    res.status(500).json({ message: 'Server error while creating the course' });
  }
});

router.put('/:id', validateObjectId, async (req, res) => {
  const { name, category, amount } = req.body;

  if (!name || !category || amount == null || amount < 0) {
    return res.status(400).json({ message: 'Invalid input: name, category, and amount are required' });
  }

  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { name, category, amount },
      { new: true, runValidators: true } 
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(updatedCourse);
  } catch (err) {
    console.error('Error updating course:', err.message);
    res.status(500).json({ message: 'Server error while updating the course' });
  }
});

router.delete('/:id', validateObjectId, async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);

    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Error deleting course:', err.message);
    res.status(500).json({ message: 'Server error while deleting the course' });
  }
});

module.exports = router;

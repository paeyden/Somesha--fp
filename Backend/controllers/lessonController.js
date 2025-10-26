const Lesson = require('../models/lesson');

// @desc    Create a new lesson
// @route   POST /api/lessons
// @access  Tutor only

const createLesson = async (req, res) => {
    const { title, content, grade } = req.body;
    try {
        if (req.user.role !== 'tutor') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const newLesson = new Lesson({ title, content, grade });
        await newLesson.save();
        res.status(201).json(newLesson);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

const getLessonsByGrade = async (req, res) => {
    const { grade } = req.params;
    try {
        const lessons = await Lesson.find({ grade });
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

const updateLesson = async (req, res) => {
    const { id } = req.params;
    const { title, content, grade } = req.body;
    try {
        if (req.user.role !== 'tutor') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const lesson = await Lesson.findById(id);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        lesson.title = title || lesson.title;
        lesson.content = content || lesson.content;
        lesson.grade = grade || lesson.grade;
        await lesson.save();
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    createLesson,
    getLessonsByGrade,
    updateLesson,
};
require('dotenv').config()

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth')

const ListTodos = require('../models/ListTodo');

// @router GET api/todos
// @desc Get ListTodo
// @access Private
router.get('/:categoryId', verifyToken, async (req, res) => {
    try {
        const Todos = await ListTodos.find({
            category: req.params.categoryId
        }).exec();
        res.json({ success: true, Todos })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})

// @router POST api/todos
// @desc Create post
// @access Private
router.post('/', verifyToken, async (req, res) => {
    const { title, description, status, category } = req.body;
    //simple validation
    if (!title) {
        return res.status(400).json({
            success: false,
            message: "title is require"
        })
    }
    try {
        const newTodo = new ListTodos({
            title,
            description,
            status: false,
            category
        })
        console.log(newTodo);
        await newTodo.save();
        res.json({ success: true, message: "Call Thành Công", todo: newTodo })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})


// @router PUT api/todos
// @desc Update todo
// @access Private

router.put('/:id', verifyToken, async (req, res) => {
    const { title, description, status } = req.body;
    //simple validation
    if (!title) {
        return res.status(400).json({
            success: false,
            message: "title is require",
        })
    }
    try {
        let updatedTodo = {
            title,
            description: description || '',
            status: status,
        }
        // console.log(updatedTodo);
        const todoUpdateCondition = {
            _id: req.params.id,
            // category: "63915fa3a51619d87e92c141"
        }
        console.log(todoUpdateCondition);
        updatedTodo = await ListTodos.findOneAndUpdate(todoUpdateCondition, updatedTodo, { new: true })

        // user not authorised to update post or post not found
        if (!updatedTodo) {
            return res.status(401).json({
                success: false,
                message: "todo not found or user not authorised"
            })
        }
        res.status(200).json({
            success: true,
            message: "Update success..!",
            post: updatedTodo
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})

// @router DELETE  api/posts
// @desc Delete post
// @access Private
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const todoDeleteCondition = {
            _id: req.params.id,
            // category: req.params.categoryId
        }
        const deleteTodo = await ListTodos.findOneAndDelete(todoDeleteCondition)
        // user not authorised to update post or post not found
        if (!deleteTodo) {
            return res.status(401).json({
                success: false,
                message: "todo not found or user not authorised"
            })
        }
        res.status(200).json({
            success: true,
            message: "Delete success..!",
            todo: deleteTodo
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})
module.exports = router;
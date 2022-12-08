require('dotenv').config()

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth')

const Category = require('../models/TodoCategory')

// @router GET api/category
// @desc Get category
// @access Private
router.get('/', verifyToken, async (req, res) => {
    console.log(req);
    try {
        const categorys = await Category.find({
            user: req.userId
        }).populate('user', ['username'])
        //populate : chiu sang bảng user để móc toàn bộ data user , và lấy ['username'] 
        res.json({ success: true, categorys })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})

// @router POST api/Categorys
// @desc Create Category
// @access Private
router.post('/', verifyToken, async (req, res) => {
    const { title } = req.body;
    //simple validation
    if (!title) {
        return res.status(400).json({
            success: false,
            message: "title is require"
        })
    }
    try {
        const newCategory = new Category({
            title,
            user: req.userId
        })
        await newCategory.save();
        res.json({ success: true, message: "Happy learning", categorys: newCategory })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})


// @router PUT api/categorys
// @desc Update Category
// @access Private

router.put('/:id', verifyToken, async (req, res) => {
    const { title } = req.body;
    //simple validation
    if (!title) {
        return res.status(400).json({
            success: false,
            message: "title is require",
        })
    }
    try {
        let updatedCategory = {
            title,
        }
        const categoryUpdateCondition = {
            _id: req.params.id,
            user: req.userId
        }
        updatedCategory = await Category.findOneAndUpdate(categoryUpdateCondition, updatedCategory, { new: true })

        // user not authorised to update Category or Category not found
        if (!updatedCategory) {
            return res.status(401).json({
                success: false,
                message: "Category not found or user not authorised"
            })
        }
        res.status(500).json({
            success: true,
            message: "Update success..!",
            category: updatedCategory
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})

// @router DELETE  api/posts
// @desc Delete Category
// @access Private
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const categoryDeleteCondition = {
            _id: req.params.id,
            user: req.userId
        }
        const deleteCategory = await Category.findOneAndDelete(categoryDeleteCondition)
        // user not authorised to update post or post not found
        if (!deleteCategory) {
            return res.status(401).json({
                success: false,
                message: "category not found or user not authorised"
            })
        }
        res.status(500).json({
            success: true,
            message: "Delete success..!",
            category: deleteCategory
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})
module.exports = router;
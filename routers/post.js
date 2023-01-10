require('dotenv').config()

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth')

const Post = require('../models/Post');

// @router GET api/posts
// @desc Get post
// @access Private
router.get('/', verifyToken, async (req, res) => {
    console.log(req);
    try {
        const posts = await Post.find({
            user: req.userId
        }).populate('user', ['username'])
        //populate : chiu sang bảng user để móc toàn bộ data user , và lấy ['username'] 
        res.json({ success: true, posts })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})

// @router POST api/posts
// @desc Create post
// @access Private
router.post('/', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body;
    //simple validation
    if (!title) {
        return res.status(400).json({
            success: false,
            message: "title is require"
        })
    }
    try {
        const newPost = new Post({
            title,
            description,
            url: url.startsWith('https://') ? url : `https://${url}`,
            status: status || 'TO LEARN',
            user: req.userId
        })
        await newPost.save();
        res.json({ success: true, message: "Happy learning", post: newPost })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})


// @router PUT api/posts
// @desc Update post
// @access Private

router.put('/:id', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body;
    //simple validation
    if (!title) {
        return res.status(400).json({
            success: false,
            message: "title is require",
        })
    }
    try {
        let updatedPost = {
            title,
            description: description || '',
            url: (url.startsWith('https://') ? url : `https://${url}`) || '',
            status: status || 'TO LEARN',
        }
        const postUpdateCondition = {
            _id: req.params.id,
            user: req.userId
        }
        updatedPost = await Post.findOneAndUpdate(postUpdateCondition, updatedPost, { new: true })

        // user not authorised to update post or post not found
        if (!updatedPost) {
            return res.status(401).json({
                success: false,
                message: "post not found or user not authorised"
            })
        }
        res.status(200).json({
            success: true,
            message: "Update success..!",
            post: updatedPost
        })
    } catch (error) {
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
        const postDeleteCondition = {
            _id: req.params.id,
            user: req.userId
        }
        const deletePost = await Post.findOneAndDelete(postDeleteCondition)
        // user not authorised to update post or post not found
        if (!deletePost) {
            return res.status(401).json({
                success: false,
                message: "post not found or user not authorised"
            })
        }
        res.status(200).json({
            success: true,
            message: "Delete success..!",
            post: deletePost
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})
module.exports = router;
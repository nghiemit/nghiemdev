require('dotenv').config()
const cors = require('cors')
const express = require('express');

const mongoose = require('mongoose');

const authRouter = require('./routers/auth')
const postRouter = require('./routers/post')
const categoryTodo = require('./routers/todoCategory')
const todo = require('./routers/listTodo')
const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mern-learnit.hyvgw4y.mongodb.net/mern-learnit?retryWrites=true&w=majority`)
        console.log("CONNECTED OK")
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}
connectDB();
const app = express();
app.use(cors())
app.get('/', (req, res) => res.send('nghiem'))

app.use(express.json())
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter)
app.use('/api/category', categoryTodo)
app.use('/api/todos', todo)




app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
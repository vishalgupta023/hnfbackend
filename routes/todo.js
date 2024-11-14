// routes/todo.js
const express = require('express');
const { addTodo, getTodos, toggleTodoCompletion, deleteTodo } = require('../controllers/todoController');
const {authenticate} = require('../middlewares/authMiddleware'); 
const { accessFor } = require('../utils/constants');
const router = express.Router();

router.post('/add', authenticate(accessFor.All), addTodo);

router.get('/get-todos',authenticate(accessFor.All) , getTodos);

router.put('/:id/toggle',authenticate(accessFor.All), toggleTodoCompletion);

router.delete('/:id',authenticate(accessFor.All), deleteTodo);

module.exports = router;

const Todo = require("../models/Todo");
const responseHandler = require("../utils/responseHandler");
const { userLog } = require("./logController");

// Add a new Todo
const addTodo = async (req, res) => {
  try {
    const { taskDetail } = req.body;
    const userId = req.user.id;

    const newTodo = new Todo({
      userId,
      taskDetail,
    });

    await newTodo.save();
    userLog(req.user, "CREATE", `Added Todo: ${taskDetail}`);
    
    responseHandler.generateSuccess(res, "Todo added successfully", newTodo);
  } catch (error) {
    responseHandler.generateError(res, "Failed to add Todo", error);
  }
};

// Get all Todos for the logged-in user
const getTodos = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const todos = await Todo.find({ userId, isDeleted: false });

    responseHandler.generateSuccess(res, "Todos fetched successfully", todos);
  } catch (error) {
    console.log("Error getting Todos", error);
    responseHandler.generateError(res, "Failed to fetch Todos", error);
  }
};

// Toggle Todo completion status
const toggleTodoCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);

    if (!todo) {
      return responseHandler.generateError(res, "Todo not found", null);
    }

    todo.completed = !todo.completed;
    await todo.save();

    userLog(req.user, "UPDATE", `Marked Todo: ${todo.taskDetail} ${todo.completed ? "Completed" : "pending"}`);
    responseHandler.generateSuccess(res, "Todo status updated successfully", todo);
  } catch (error) {
    responseHandler.generateError(res, "Failed to toggle Todo status", error);
  }
};

// Delete a Todo (Soft delete)
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);

    if (!todo) {
      return responseHandler.generateError(res, "Todo not found", null);
    }

    todo.isDeleted = true;
    await todo.save();

    userLog(req.user, "DELETE", `Deleted Todo: ${todo.taskDetail}`);
    responseHandler.generateSuccess(res, "Todo deleted successfully", null);
  } catch (error) {
    responseHandler.generateError(res, "Failed to delete Todo", error);
  }
};

module.exports = {
  addTodo : addTodo,
  getTodos : getTodos,
  toggleTodoCompletion : toggleTodoCompletion,
  deleteTodo : deleteTodo,
};

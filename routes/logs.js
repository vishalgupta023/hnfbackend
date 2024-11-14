// routes/todo.js
const express = require('express');
const {authenticate} = require('../middlewares/authMiddleware'); 
const { accessFor } = require('../utils/constants');
const { getUserLogs, getAllUsersLogs, softDeleteLog } = require('../controllers/logController');
const router = express.Router();


router.get('/get-logs' , getUserLogs);
router.get('/get-all-logs' , getAllUsersLogs);
router.delete('/delete-log/:id',authenticate(accessFor.All), softDeleteLog);

module.exports = router;

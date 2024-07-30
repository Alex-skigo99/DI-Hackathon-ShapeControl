const {
    login,
    getPrograms,
    signup,
    insertUser,
    updateUser,
    deleteUser,
    loginUser
} = require('../controllers/controller.js');

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {res.render('index')});

router.post('/api/login', login);
router.post('/api/signup', signup);
router.get('/api/programs', getPrograms);
// router.post('/register', insertUser);
// router.put('/users/:id', updateUser);
// router.delete('/users/:id', deleteUser);

module.exports = {
    router
};
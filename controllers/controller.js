const bcrypt = require('bcrypt');

const {
    _login,
    _getLastProgram,
    _signup,
    // _updateUser,
    // _deleteUser,
    // _loginUser
} = require('../models/model.js');

// const login = (req, res) => {
//     const {username} = req.body;
//     _login(username)
//         .then(([is_login, is_current]) => {
//             if (!is_login) {
//                 let err_login = 'Username not found'
//                 res.render('login', {err_login})
//             }
//             // if (is_current) {
//             //     res.render('current')
//             // }
//             // res.render('new')
//             res.render('current')
//         })
//         .catch(e => {
//             res.status(404).json({message:'something went wring!!!', error: e});
//         })
// };
const login = (req, res) => {
    const {username} = req.body;
        _login(username)
        .then(user => {
            let result = user ? {is_login: true, user} : {is_login: false, user};
            res.json(result);
        })
        .catch (e => {
            res.status(404).json({message:'something went wring!!!', error: e})
        })
};

const signup = (req, res) => {
    // const {username} = req.body;
    _signup(req.body)
    .then(user => {
        res.json({is_signup: true, user});
    })
    .catch(err => {
        // res.status(404).json({error: err})
        res.json({is_signup: false, error: err});
    });
};

const getPrograms = (req, res) => {
    const { name, user } = req.query;
    if (name == 'last') {
        const result = _getLastProgram(user);
        res.json(result)
    };
}

const getOneUser = (req, res) => {
    const { id } = req.params;
    _getOneUser(id)
        .then(result => {
            res.json(result)
        })
        .catch(e => {
            res.status(404).json({message:'something went wrong!!!'});
        })
};

const insertUser = (req, res) => {
    const {email, username, first_name, last_name, password} = req.body;
    _insertUser(email, username, first_name, last_name, password)
    .then(result => {
        res.json(result);
    })
    .catch(e => {
        res.status(404).json({message:'something went wrong!!!'});
    })
};

const updateUser = (req, res) => {
    const { id } = req.params;
    const {email, username, first_name, last_name, password} = req.body;
    _updateUser(id, email, username, first_name, last_name, password)
    .then(result => {
        res.json(result);
    })
    .catch(e => {
        res.status(404).json({message:'something went wrong!!!'});
    })
};

const deleteUser = (req, res) => {
    const { id } = req.params;
    _deleteUser(id)
        .then(result => {
            res.json(result)
        })
        .catch(e => {
            res.status(404).json({message:'something went wrong!!!'});
        })
};

async function loginUser (req, res) {
    const {username, email, password} = req.body;
    try {
        const result = await _loginUser(username, email);
        if (!result) {
            res.status(404).json({message:'Username not found'});
        };
        console.log(result.password, password);
        const passMatch = await bcrypt.compare(password+'', result.password)
        if (!passMatch) {
            res.status(401).json({massage: 'Password failed'})
        };
        res.status(200).json({
            message: 'Authorized...', 
            user_id: result.id,
            username: result.username
        });
    } catch (e) {
        res.status(404).json({message:'something went wrong!!!'})
    }
};

module.exports = {
    login,
    getPrograms,
    signup,
    // insertUser,
    // updateUser,
    // deleteUser,
    // loginUser
};

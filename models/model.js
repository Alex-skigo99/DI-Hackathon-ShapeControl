const {db} = require('../config/db.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const table = 'users';


const _getOneUser = (id) => {
    return db(table)
        .select('id', 'email', 'username', 'first_name', 'last_name')
        .where({id: id})
};

const _insertUser = async (email, username, first_name, last_name, password) => {
    const trx = await db.transaction();
    try {
        const [user] = await trx('users').insert({
            username,
            email,
            first_name,
            last_name
          }).returning('id', 'username', 'email');
        const hash = await bcrypt.hash(password+'', saltRounds);
        await trx('hashpwd').insert ({
            user_id: user.id,
            password: hash
        });
        await trx.commit();
        return user
    } catch (error) {
        await rollback();
        throw error
    }
};

const _updateUser = async (id, email, username, first_name, last_name, password) => {
    const trx = await db.transaction();
    try {
        const [user] = await trx('users')
        .where ({id: id})
        .update({
            username,
            email,
            first_name,
            last_name
          })
        .returning('id', 'username', 'email');
        const hash = await bcrypt.hash(password+'', saltRounds);
        await trx('hashpwd')
        .where ({user_id: id})
        .update ({password: hash});
        await trx.commit();
        return user
    } catch (error) {
        await rollback();
        throw error
    }
};

const _deleteUser = (id) => {
    return db(table)
        .where({id: id})
        .delete()
};

const _loginUser = async (username, email) => {
    try {
        const user = await db('users')
            .select('users.id', 'users.email', 'users.username', 'hashpwd.password')
            .join('hashpwd', {'users.id': 'hashpwd.user_id'})
            .where('users.username', username)
            .orWhere('users.email', email)
            .first();
            return user
    } catch (error) {
        throw error
    }
};

const _login = (input_username) => {
    const user = db('users')
        .select('id', 'username')
        .where({'username': input_username})
        .first()
        .returning('id', 'username');
    return user;
};

const _signup = async (userData) => {
    console.log('_signup userdata: ', userData);  // --------------
    try {
        // const hash = await bcrypt.hash(password+'', saltRounds);
        const [user] = await db('users').insert(userData).returning('id', 'username');
        return user
    } catch (err) {
        throw err
    }
};

const _getLastProgram = (user) => {
    return {
        prog_name: 'last program',
        level: 'progress',
        in_weight: 70,
        out_weight: 69,
        is_close: false,
        days: [
            {
                day: 'sunday',
                plan: 2000,
                fact: 2000,
                is_training: false,
                comment: 'I was sick and bla bla bla'
            },
            {
                day: 'monday',
                plan: 2000,
                fact: 2500,
                is_training: true,
                comment: 'I was sick and bla bla bla'
            },
            {
                day: 'tuesday',
                plan: 2000,
                fact: 1900,
                is_training: false,
                comment: 'I was sick and bla bla bla'
            },
            {
                day: 'wednesday',
                plan: 2000,
                fact: undefined,
                is_training: false,
                comment: 'I was sick and bla bla bla'
            },
            {
                day: 'thursday',
                plan: 2000,
                fact: undefined,
                is_training: false,
                comment: 'I was sick and'
            },
            {
                day: 'friday',
                plan: 2000,
                fact: undefined,
                is_training: true,
                comment: 'I was sick and bla bla bla'
            },
            {
                day: 'saturday',
                plan: 2000,
                fact: undefined,
                is_training: false,
                comment: 'I was sick and bla bla bla'
            },
        ]
    }

}


module.exports = {
    _login,
    _getLastProgram,
    _signup,
    // _updateUser,
    // _deleteUser,
    // _loginUser
};
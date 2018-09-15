const constants=require('./constants'),
cookieParser = require('cookie-parser'),
    jwt = require('express-jwt');
    import bcrypt from 'bcrypt';

async function getUser(request) {
    return new Promise((resolve, reject) => {
        const doTheThing=() => {
                request.headers.authorization = request.cookies['auth._token.' + request.cookies['auth.strategy']]
                if (request.headers.authorization === 'false') {
                    return reject('No Auth token found')
                }
                jwt({
                    secret: constants.secret
                })(request, request.res, err => {
                    if (err) {
                        reject(err)
                    }
                    resolve(request.user)
                })
            }
        if (!request.cookies) {
            cookieParser()(request, request.res, doTheThing)
        } else {
            doTheThing()
        }
    })

}

async function hashPassword(password){
    return bcrypt.hash(password, constants.saltRounds)
}
async function checkPassword(password, hash){
    return bcrypt.compare(password, hash)
}

module.exports = {
    constants,
    getUser,
    hashPassword,
    checkPassword
}
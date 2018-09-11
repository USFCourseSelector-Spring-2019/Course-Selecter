const constants=require('./constants'),
cookieParser = require('cookie-parser'),
    jwt = require('express-jwt');

async function getUser(request) {
    return new Promise((resolve, reject) => {
        const doTheThing=() => {
                request.headers.authorization = request.cookies['auth._token.' + request.cookies['auth.strategy']]
                if (request.headers.authorization === 'false') {
                    return reject('no auth token found')
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

module.exports = {
    constants,
    getUser
}
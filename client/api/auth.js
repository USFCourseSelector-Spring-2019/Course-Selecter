const jsonwebtoken = require('jsonwebtoken')
const { getUser, constants: { secret } } = require('../api_helpers')

class AuthController {
    constructor(request) {

        this.request = request;
        this.user = getUser(request)
    }
    isCorrectPassword(password, user) {
        return password === user.user_cred
    }
    async login({ body: { username, password } }) {
        console.log(username, password, 'attempting...')
        /*const [user] = await mysql({
            query: USING_SEPERATE_ATC_DB ? 'SELECT * FROM org_users WHERE email= :email' : 'SELECT * FROM console_users WHERE email= :email',
            database: 'air_traffic_control',
            params: {
                email: username.toLowerCase()
            }
        })

        console.log(user)
        if (!user || !this.isCorrectPassword(password, user)) {
            console.log('wrong password')
            throw new Error('Invalid username or password')
        }
        console.log('Logging in:', username)*/

        const accessToken = jsonwebtoken.sign({
                username: username,
                scope: ['user'],
                plans: [],
                plan: 0
            },
            secret
        )

        return {
            token: { accessToken }
        }

    }
    async getUser() {
        const user = await this.user
        console.log('Getting User', user)
        return { user }
    }
    async logout() {
        return { status: 'OK' }
    }
    async changePassword({ body: { current_password, new_password } }) {
        /*const { database, email } = this.user
        const [user] = await mysql({
            query: 'SELECT * FROM console_users WHERE email= :email',
            database: 'air_traffic_control',
            params: {
                email
            }
        })

        if (!user || !this.isCorrectPassword(current_password, user)) {
            throw new Error('Incorrect password')
        }

        await mysql({
            query: 'UPDATE console_users SET user_cred= :new_password WHERE client= :database AND email= :email',
            database: 'air_traffic_control',
            params: {
                database,
                email,
                new_password
            }
        })
        return { ok: true }*/
    }
}

AuthController.ROUTES = {
    login: {
        path: '/login', // /api/Devices/:type
        verb: 'POST'
    },
    getUser: {
        path: '/user',
        verb: 'GET'
    },
    logout: {
        path: '/logout',
        verb: 'POST'
    },
    changePassword: {
        path: '/changePassword',
        verb: 'POST'
    }
}

module.exports = AuthController
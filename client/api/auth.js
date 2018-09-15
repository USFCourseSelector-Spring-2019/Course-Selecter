import jsonwebtoken from 'jsonwebtoken';
const { getUser, constants: { secret }, checkPassword } = require('../api_helpers')
import nano from 'nano'
class AuthController {
    constructor(request) {

        this.request = request;
        this.user = getUser(request)
        this.nano = new nano( /*context.isDev*/ true ? 'http://localhost:5984/' : 'http://db.courseselector.com/')
        this.userDB = this.nano.use('users')
    }
    async isCorrectPassword(password, user) {
        return await checkPassword(password,user.user_cred)
    }
    async login({ body: { username, password } }) {
        console.log(username, password, 'attempting...')
        const user = await this.userDB.get(username)

        console.log(user)
        if (!user || !(await this.isCorrectPassword(password, user))) {
            console.log('wrong password for', username)
            throw new Error('Invalid username or password')
        }
        console.log('Logging in:', username)

        const accessToken = jsonwebtoken.sign({
                username: username,
                scope: ['user'],
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
    async savePlans({ body: { plans, plan } }) {
        const { username } = await this.user
        const curUserObj = await this.userDB.get(username)
        await this.userDB.insert({ ...curUserObj, plans, plan })
        return { status: 'OK'}
    }
    async getPlans() {
        const { username } = await this.user
        const { plans, plan } = await this.userDB.get(username)
        return { plans, plan }
    }
    async changePassword({ body: { current_password, new_password } }) {
        const { username } = await this.user
        const curUserObj = await this.userDB.get(username)
        
        if (!user || !this.isCorrectPassword(current_password, curUserObj)) {
            throw new Error('Incorrect password')
        }
        await this.userDB.insert({ ...curUserObj, user_cred:new_password })

        return { ok: true }
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
    },
    savePlans: {
        path: '/plans',
        verb: 'POST'
    },
    getPlans: {
        path: '/plans',
        verb: 'GET'
    }
}

module.exports = AuthController
import nano from 'nano';
const { constants, hashPassword } = require('../api_helpers')
const stripe = require("stripe")("sk_test_NqR71Jtkq7zpa1vsdyrwFMf7");
class PaymentController {
    constructor(request) {
        this.request = request
        this.nano = new nano( /*context.isDev*/ true ? 'http://localhost:5984/' : 'http://db.courseselector.com/')
        this.userDB = this.nano.use('users')
    }
    async userWithUsernameExists({params:{username}}){
        const user = await this.userDB.get(username)
        if(user&&user._id){
            return {user_exists:true,username}
        }
        return {user_exists:false,username}
    }
    async pay({
        body: {
            token,
            email,
            username,
            password
        }
    }) {
        if(!token||!email||!username||!password){
            throw new Error('All Fields Required')
        }
        if((await this.userWithUsernameExists({params:{username}})).user_exists){
            throw new Error('Username is in use')
        }
        console.log(token)
        const charge = await stripe.charges.create({
            amount: 799,
            currency: 'usd',
            description: 'USF Course Selector Premium',
            source: token,
            metadata:{
                school:'USF'
            },
            receipt_email: email
        })
        console.log(charge)
        if(charge.status!=='succeeded'){
            throw new Error('Payment Failed')
        }
        return await this.createAccount({body:{username,password}})
    }
    async createAccount({body:{
        username,
        password
    }}){
        const userObj = {'_id':username,plan:0,plans:[],user_cred:await hashPassword(password)}
        //create the account
        //hash password put into api_helpers
        await this.userDB.insert(userObj)
        return {success:true, username}
    }
}

PaymentController.ROUTES = {
    pay: {
        path: '/pay',
        verb: 'POST'
    },
    userWithUsernameExists:{
        path: '/:username/exists',
        verb:'GET'
    }
}

module.exports = PaymentController
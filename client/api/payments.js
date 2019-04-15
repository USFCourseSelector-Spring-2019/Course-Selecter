import nano from "nano";
const { constants, hashPassword } = require("../api_helpers");
const stripe = require("stripe")("sk_test_NqR71Jtkq7zpa1vsdyrwFMf7");
export default class PaymentController {
  constructor(request) {
    this.request = request;
    this.nano = new nano(
      /*context.isDev*/ true
        ? "http://localhost:5984/"
        : "http://db.courseselector.com/"
    );
    this.userDB = this.nano.use("users");
  }
  async userWithUsernameExists({ params: { username } }) {
    try {
      const user = await this.userDB.get(username);
      return {
        user_exists: true,
        ok: true
      };
    } catch (err) {
      return {
        user_exists: false,
        ok: false
      };
    }
  }
  async pay({ body: { token, email, username, password } }) {
    if (!token || !username || !password) {
      throw new Error("Username and Password Fields Required");
    }
    if (
      (await this.userWithUsernameExists({ params: { username } })).user_exists
    ) {
      throw new Error("Username is in use");
    }
    console.log(token, username, password, email);
    const charge = await stripe.charges.create({
      amount: 199,
      currency: "usd",
      description: "USF Course Selector Premium",
      source: token,
      metadata: {
        school: "USF"
      }
    });
    if (email) {
      charge.receipt_email = email;
    }
    //console.log(charge)
    if (charge.status !== "succeeded") {
      throw new Error("Payment Failed");
    }
    return await this.createAccount({ body: { username, password } });
  }
  async createAccount({ body: { username, password } }) {
    const userObj = {
      _id: username,
      plan: 0,
      plans: [{ title: "My First Plan", courses: [] }],
      user_cred: await hashPassword(password)
    };
    //create the account
    //hash password put into api_helpers
    await this.userDB.insert(userObj);
    return { ok: true, username };
  }
}

PaymentController.ROUTES = {
  pay: {
    path: "/pay",
    verb: "POST"
  },
  userWithUsernameExists: {
    path: "/:username/exists",
    verb: "GET"
  }
};

module.exports = PaymentController;
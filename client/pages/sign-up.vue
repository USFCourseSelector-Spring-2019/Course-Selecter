<template>
    <v-container>
        <h1 class="display-2">USF Course Selector Signup</h1>
        <v-card>
            <v-card-text>
                <v-form v-model="valid" ref="form" :class="{'has-error':error}" autocomplete="off">
                    <v-text-field v-model="username" :rules="rules.usernameRules" label="Username" type="text" required :error="error||usernameError" :messages="usernameTaken?'Username is taken':''" v-focus></v-text-field>
                    <v-text-field v-model="password" :rules="rules.passwordRules" label="Password" required :append-icon="passwordVisible ? 'visibility' : 'visibility_off'" @click:append="() => (passwordVisible = !passwordVisible)" :type="passwordVisible ? 'password' : 'text'" v-on:keyup.13="submit" :error="error"></v-text-field>
                    <v-text-field v-model="email" :rules="[rules.email]" label="E-mail" hint="Optional - used only to send receipt and not saved to account" type="email"></v-text-field>
                    <h3 class="title" v-if="paybuttonAvailable">Select a payment method:</h3>
                    <div ref="paybtn" class="paybtn my-3"></div>
                    <div ref="card"></div>
                    <expander :expanded="hasCardErrors">
                        <v-alert :value="true" type="error">Something went wrong proccessing your payment</v-alert>
                    </expander>
                    <v-btn @click="pay" color="primary" class="primary-fg--text right mt-2">
                        Pay $7.99
                    </v-btn>
                    <div class="clear"></div>
                </v-form>
            </v-card-text>
        </v-card>
        <script src="https://js.stripe.com/v3/"></script>
    </v-container>
</template>
<script>
export default {
    auth: false,
    async asyncData() {

    },
    mounted: function() {
        const interval = setInterval(() => {
            if (window.Stripe !== undefined) {
                clearInterval(interval);
                this.stripe = window.Stripe(`pk_test_KGIFBjXAWP2SCczaJycN8Njl`)
                const elements = this.stripe.elements()
                this.card = elements.create('card');
                this.card.mount(this.$refs.card);
                const paymentRequest = this.stripe.paymentRequest({
                    country: 'US',
                    currency: 'usd',
                    total: {
                        label: 'USF Course Selector',
                        amount: 799,
                    },
                    requestPayerName: true,
                    requestPayerEmail: true,
                });
                const prButton = elements.create('paymentRequestButton', {
                    paymentRequest,
                });
                (async() => {
                    // Check the availability of the Payment Request API first.
                    const result = await paymentRequest.canMakePayment();
                    if (result) {
                        console.log('available')
                        prButton.mount(this.$refs.paybtn);
                        this.paybuttonAvailable = true
                    } else {
                        this.$refs.paybtn.style.display = 'none';
                        this.paybuttonAvailable = false
                    }
                })();
                paymentRequest.on('token', async(ev) => {
                    // Send the token to your server to charge it!
                    const response = await this.charge({
                        token: ev.token.id
                    })

                    if (response.ok) {
                        // Report to the browser that the payment was successful, prompting
                        // it to close the browser payment interface.

                        ev.complete('success');
                        return this.goToOnboarding(response)
                    } else {
                        // Report to the browser that the payment failed, prompting it to
                        // re-show the payment interface, or show an error message and close
                        // the payment interface.
                        ev.complete('fail');
                        return this.failed()
                    }
                });
            }
        }, 10)
    },
    data() {
        return {
            complete: false,
            stripe: undefined,
            card: undefined,
            paybuttonAvailable: false,
            hasCardErrors: false,
            valid: true,
            error: false,
            username: '',
            password: '',
            email: '',
            passwordVisible: true,
            usernameTaken: false,
            rules: {
                required: value => !!value || 'Required.',
                usernameRules: [
                    v => !!v || 'Username is required'
                ],
                password: '',
                passwordRules: [
                    v => !!v || 'Password is required'
                ],
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return !value ? true : (pattern.test(value) || 'Invalid e-mail.')
                }
            }
        }
    },
    watch: {
        async username(username) {
            const {
                user_exists
            } = await this.$api.payments.userWithUsernameExists({
                params: {
                    username
                }
            })
            this.usernameTaken = user_exists
        }
    },
    methods: {
        async pay() {
            const {
                error,
                token
            } = await this.stripe.createToken(this.card)
            if (error) {
                this.hasCardErrors = true;
                this.$forceUpdate(); // Forcing the DOM to update so the Stripe Element can update.
                return;
            }
            if (this.$refs.form.validate()) {
                console.log(token)
                const response = await this.charge({
                    token: token.id
                })
                if (response.ok) {
                    return await this.goToOnboarding(response.username)
                }
                return this.failed()
            }
        },
        async charge({
            token
        }) {
            if (this.$refs.form.validate()) {
                try {
                    const resp = await this.$api.payments.pay({
                        body: {
                            token,
                            username: this.username,
                            password: this.password,
                            email: this.email
                        }
                    })
                    console.log(resp)
                    if (resp.ok) {
                        //we got it 
                    } else {

                    }
                    return {
                        ok: resp.ok
                    }
                } catch (err) {
                    console.log(err)
                    return {
                        ok: false,
                        reason: err
                    }
                }
            } else {
                return {
                    ok: false
                }
            }
        },
        async failed() {
            //do any displaying error messages and such
        },
        async goToOnboarding(username) {
            //move on to onboarding as payment has been placed
        }
    },
    computed: {
        usernameError() {
            return this.usernameTaken
        }
    }
}
</script>
<style>
.StripeElement:not(.paybtn) {
    background-color: white;
    height: 40px;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid transparent;
    box-shadow: 0 1px 4px 0 #A6AbB1;
    -webkit-transition: box-shadow 150ms ease;
    transition: box-shadow 150ms ease;
}

.StripeElement--focus {
    box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
    border-color: #fa755a;
}

.StripeElement--webkit-autofill {
    background-color: #fefde5 !important;
}

.clear {
    clear: both;
}
</style>

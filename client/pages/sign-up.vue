<template>
    <v-container>
        <h1 class="display-2">USF Course Selector Signup</h1>
        <div ref="card"></div>
        <v-btn @click="pay" color="primary" class="primary-fg--text">
            Pay $7.99
        </v-btn>
        <script src="https://js.stripe.com/v3/"></script>
    </v-container>
</template>
<script>
export default {
    auth: false,
    async asyncData() {

    },
    mounted: function() {
        this.stripe = window.Stripe(`pk_test_KGIFBjXAWP2SCczaJycN8Njl`)
        const elements = this.stripe.elements()
        this.card = elements.create('card');
        this.card.mount(this.$refs.card);
    },
    data() {
        return {
            complete: false,
            stripeOptions: {

            },
            stripe: undefined,
            card: undefined
        }
    },
    methods: {
        async pay() {
            const {
                error,
                token
            } = await this.stripe.createToken(this.card)
            if (error) {
                self.hasCardErrors = true;
                self.$forceUpdate(); // Forcing the DOM to update so the Stripe Element can update.
                return;
            }
            console.log(token)
            const resp = await this.$api.payments.pay({
                body: {
                    token: token.id
                }
            })
            console.log(resp)
        }
    },
    components: {}
}
</script>
<style>
.StripeElement {
    background-color: white;
    height: 40px;
    padding: 10px 12px;
    border-radius: 4px;
    border: 1px solid transparent;
    box-shadow: 0 1px 3px 0 #e6ebf1;
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
</style>

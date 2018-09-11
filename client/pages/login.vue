<template>
    <div class="fill-height layout justify-center align-center">
        <v-card class="flex sign-in-card" raised>
            <v-card-title>
                <h1 class="display-1">Sign In</h1>
            </v-card-title>
            <v-card-text>
                <v-form v-model="valid" ref="form" :class="{'has-error':error}" autocomplete="off">
                    <v-text-field v-model="username" :rules="usernameRules" label="Username" type="text" required :error="error" v-focus clearable></v-text-field>
                    <v-text-field v-model="password" :rules="passwordRules" label="Password" required :append-icon="passwordVisible ? 'visibility' : 'visibility_off'" @click:append="() => (passwordVisible = !passwordVisible)" :type="passwordVisible ? 'password' : 'text'" v-on:keyup.13="submit" :error="error" clearable></v-text-field>
                    <v-layout>
                        <v-spacer></v-spacer>
                        <v-btn :disabled="!valid" @click="submit" color="primary" ripple>
                            Sign in
                        </v-btn>
                    </v-layout>
                </v-form>
            </v-card-text>
            <expander :expanded="error" style="position:absolute;left:0;right:0;">
                <v-alert :value="true" type="error">Invalid Username or Password... Please Try again!</v-alert>
            </expander>
        </v-card>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    auth: false,
    data() {
        return {
            passwordVisible: true,
            valid: false,
            error: false,
            username: '',
            usernameRules: [
                v => !!v || 'Username is required'
            ],
            password: '',
            passwordRules: [
                v => !!v || 'Password is required'
            ]
        }
    },
    layout: 'auth',
    methods: {
        async submit() {
            if (this.$refs.form.validate()) {
                // Makes a POST Request to /login
                // this.username and this.password are constantly in sync with the 'v-text-field' and stored in javascript
                console.log("Trying to POST", JSON.stringify({
                    username: this.username,
                    password: this.password
                }), `to: https://${document.location.hostname}:3000/auth/login`)
                return this.$auth
                    .loginWith('local', {
                        data: {
                            username: this.username,
                            password: this.password
                        }
                    })
                    .catch(e => {
                        console.error(e)
                        this.error = true
                        this.valid = false
                    }).then(() => {
                        console.log('Signed in successfully!')
                            //need to redirect if still on this page after
                            //axios.defaults.headers.common['Authorization'] = this.$auth.$storage._state['_token.local']
                        this.$router.push('/dashboard')
                    })

            } else {

            }
        }
    },
    watch: {
        username() {
            this.error = false
        },
        password() {
            this.error = false
        }
    },
    head() {
        return {
            title: 'Sign In - Course Selector'
        }
    }
}
</script>
<style>
.sign-in-card {
    max-width: 600px;
    width: 100%;
}
</style>

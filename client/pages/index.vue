<!-- <template>
<v-container>
  <div class="image">
    <img src="/mockup.png">
  </div>
  <div class="image1">
    <img src="/iPhoneMockup.png">
  </div>
  <div class="hero-image">
  </div>
</v-container>
</template> -->



<template>
<!-- <div class="fill-height layout wrap justify-center align-center">
      <div class="fill-height layout justify-center align-center">
          <v-card class="flex sign-in-card" raised>
              <v-card-title>
                  <h1 class="display-1">Sign In</h1>
              </v-card-title>
              <v-card-text>
                  <v-form v-model="valid" ref="form" :class="{'has-error':error}" autocomplete="off">
                      <v-text-field v-model="username" :rules="usernameRules" label="Username" type="text" required :error="error" v-focus clearable></v-text-field>
                      <v-text-field v-model="password" :rules="passwordRules" label="Password" required :append-icon="passwordVisible ? 'visibility' : 'visibility_off'" @click:append="() => (passwordVisible = !passwordVisible)" :type="passwordVisible ? 'password' : 'text'" v-on:keyup.13="submit" :error="error" clearable></v-text-field>
                      <v-layout align-center>
                          <a href="/sign-up">Don't have an account? Sign Up!</a>
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
      </div> -->
<v-container>
  <div class="LandingPageText">
    <h1> Course Selecting,
    </h1>
    <h2> Like it should be.
    </h2>
  </div>
  <div class="Mac">
    <img style="width:100%; height:100%" src="/mockup.png">
  </div>
  <div class="iPhone">
    <img style="width:100%; height:100%" src="/iPhoneMockup.png">
  </div>
  <div class="hero-image">
  </div>
  <!-- <v-card class="flex xs12 sm8 md6 mx-auto" to="/courses">
    <h1 class="title text-xs-center font-weight-regular pt-3">We handle registration, you handle college</h1>
    <v-card-text>
      This website help you pick and plan your courses faster!
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" flat nuxt to="/courses">Search for Courses</v-btn>
    </v-card-actions>
  </v-card>
  <v-card class="flex xs12 sm8 md6 mx-auto my-5">
    <h1 class="title text-xs-center font-weight-regular pt-3">About</h1>
    <v-card-text class="body-1">
      Picking classes has to be one of the worst experiences in college. Constantly trying to make sure that you are progressing with your degree yet also juggling making sure that you have interesting (even fun if you are ambitious) classes while
      also creating a schedule that you won't dread for the whole semester. On top of all those things you have to keep in mind, you have to deal with the colleges terrible system for picking courses and have at least a million tabs open to the point
      that you forget which tab shows which little bit of info you need to make a reasonable schedule for a semester. It sure is a lot of pressure on you and the tools <span class="font-weight-bold">should</span> make the process easier not harder,
      so I made a course selector for USF students like you so that you can pick your courses with ease and still be on your way to your goal of graduating.
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" flat nuxt to="/about">Learn More</v-btn>
    </v-card-actions>
  </v-card> -->
</v-container>
</template>

<script>
export default {
  auth: false
  // data() {
  //     return {
  //         passwordVisible: true,
  //         valid: false,
  //         error: false,
  //         username: '',
  //         usernameRules: [
  //             v => !!v || 'Username is required'
  //         ],
  //         password: '',
  //         passwordRules: [
  //             v => !!v || 'Password is required'
  //         ]
  //     }
  // },
  // layout: 'auth',
  // methods: {
  //     async submit() {
  //         if (this.$refs.form.validate()) {
  //             // Makes a POST Request to /login
  //             // this.username and this.password are constantly in sync with the 'v-text-field' and stored in javascript
  //             console.log("Trying to POST", JSON.stringify({
  //                 username: this.username,
  //                 password: this.password
  //             }), `to: https://${document.location.hostname}:3000/auth/login`)
  //             return this.$auth
  //                 .loginWith('local', {
  //                     data: {
  //                         username: this.username,
  //                         password: this.password
  //                     }
  //                 })
  //                 .catch(e => {
  //                     console.error(e)
  //                     this.error = true
  //                     this.valid = false
  //                 }).then(() => {
  //                     console.log('Signed in successfully!')
  //                         //need to redirect if still on this page after
  //                         //axios.defaults.headers.common['Authorization'] = this.$auth.$storage._state['_token.local']
  //                     this.$router.push('/dashboard')
  //                 })
  //
  //         } else {
  //
  //         }
  //     }
  // },
  // watch: {
  //     username() {
  //         this.error = false
  //     },
  //     password() {
  //         this.error = false
  //     }
  // },
  // head() {
  //     return {
  //         title: 'Sign In - Course Selector'
  //     }
  // }
}
</script>

<style>
body,
html {
  height: 100%;
}

.iPhone {
  height: 300px;
  width: 300px;
  /* margin-left: auto;
  margin-right: auto; */
  position: relative;
  float: right;
  z-index: 1;
  /* right: 200px; */
}

.Mac {
  height: 500px;
  width: 500px;
  margin-left: auto;
  margin-right: auto;
  position: absolute;
  right: 100px;
  z-index: 1;
}

/* The hero image */
.hero-image {
  background-image: url("/icon.png");

  height: 500px;
  width: 500px;

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  margin-left: auto;
  margin-right: auto;
}

.LandingPageText {
  float: left;
}
</style>

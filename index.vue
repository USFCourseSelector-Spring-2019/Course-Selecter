<template>
<v-container>
  <div class="LandingPageText">
    <h1 class="header1"> Course Selecting,
    </h1>
    <h2 class="header2"> Like it should be.
    </h2>
    <h3 class="header3"> You handle college, we'll handle registration.
      A simple, faster, more pleasurable experience.
    </h3>
  </div>
  <div class="Mac">
    <img style="width:100%; height:100%" src="/mockup.png">
  </div>
  <div class="iPhone">
    <img style="width:100%; height:100%" src="/iPhoneMockup.png">
  </div>
  <div class="hero-image">
  </div>
  <v-card class="flex xs12 sm8 md6 mx-auto" to="/courses">
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
  </v-card>
</v-container>
</template>

<script>
export default {
  auth: false
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
  position: absolute;
  top: 375px;
  right: -20px;
  z-index: 1;
}

.Mac {
  height: 600px;
  width: 600px;
  margin-left: auto;
  margin-right: auto;
  position: absolute;
  right: 20px;
  z-index: 1;
}

/* The hero image */
.hero-image {
  background-image: url("/icon.png");

  height: 500px;
  width: 500px;

  /* background-position: center; */
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  top: 1px;
  margin-left: auto;
  margin-right: auto;
}

.LandingPageText {
  position: relative;
  top: 300px;
}

.header1 {
  font-family: Open Sans, sans-serif;
  font-size: 2.2rem;
  letter-spacing: -.05rem;
}

.header2 {
  font-size: 2.2rem;
}

.header3 {
  font-size: 1.2rem;
  font-weight: 200;
  width: 250px;
  word-wrap: break-word;
  color: #2F4F4F;
}
</style>

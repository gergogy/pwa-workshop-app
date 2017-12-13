<template>
  <div class="md-layout md-alignment-center-center">
    <form novalidate class="md-layout-item md-xsmall-size-100 md-small-size-75 md-size-50" @submit.prevent="validateUser">
      <md-card>
        <md-card-header>
          <div class="md-title">Sign up</div>
        </md-card-header>

        <md-card-content>
          <md-steppers :md-active-step.sync="active" md-vertical md-linear>
            <md-step id="first" md-label="Login credentials" md-description="Required" :md-error="steps.first.currentError" :md-editable="false" :md-done.sync="steps.first.done">
                <md-field :class="getValidationClass('email')">
                  <label for="email">Email</label>
                  <md-input type="email" name="email" id="email" autocomplete="email" v-model="form.email" :disabled="sending || !isOnline" @input="$v.account.$touch"/>
                  <span class="md-error" v-if="!$v.form.email.required">The email is required</span>
                  <span class="md-error" v-else-if="!$v.form.email.email">Invalid email</span>
                  <span class="md-error" v-else-if="steps.first.currentError">{{steps.first.currentError}}</span>
                </md-field>

                <md-field :class="getValidationClass('password')">
                  <label for="password">Password</label>
                  <md-input type="password" name="password" id="password" autocomplete="password" v-model="form.password" :disabled="sending || !isOnline" @input="$v.account.$touch"/>
                  <span class="md-error" v-if="!$v.form.password.required">Password is required!</span>
                  <span class="md-error" v-if="!$v.form.password.minLength">Too short, at least 8 characters</span>
                </md-field>

                <md-button class="md-raised md-primary" type="button" @click="setDone('first', 'second')" :disabled="$v.account.$invalid">Continue</md-button>
            </md-step>

            <md-step id="second" md-label="Personal details" :md-error="steps.second.currentError" md-description="Required" :md-editable="false" :md-done.sync="steps.second.done">
              <md-field :class="getValidationClass('firstName')">
                <label for="first-name">First Name</label>
                <md-input name="firstname" id="first-name" autocomplete="given-name" v-model="form.firstName" :disabled="sending || !isOnline" @input="$v.personal.$touch"/>
                <span class="md-error" v-if="!$v.form.firstName.required">The first name is required</span>
                <span class="md-error" v-else-if="!$v.form.firstName.minlength">Invalid first name</span>
              </md-field>

              <md-field :class="getValidationClass('lastName')">
                <label for="last-name">Last Name</label>
                <md-input name="lastname" id="last-name" autocomplete="family-name" v-model="form.lastName" :disabled="sending || !isOnline" @input="$v.personal.$touch"/>
                <span class="md-error" v-if="!$v.form.lastName.required">The last name is required</span>
                <span class="md-error" v-else-if="!$v.form.lastName.minlength">Invalid last name</span>
              </md-field>

              <md-button class="md-raised md-primary" type="submit" @click="setDone('second', 'third')" :disabled="$v.personal.$invalid">Sign up</md-button>
            </md-step>
          </md-steppers>
        </md-card-content>
      </md-card>
    </form>
    <md-snackbar md-position="center" :md-duration="Infinity" :md-active="!isOnline" md-persistent>
      <span>You are offline!</span>
    </md-snackbar>
  </div>
</template>

<script>
  import { required, email, minLength } from 'vuelidate/lib/validators'
  import axios from 'axios'
  import { API_BASE_URL, JWT_COOKIE_NAME } from '../../config'

  export default {
    name: 'register',
    computed: {
      isOnline () {
        return navigator.onLine;
      }
    },
    data: () => ({
      form: {
        firstName: null,
        lastName: null,
        email: null,
        password: null
      },
      active: 'first',
      steps: {
        first: {
          done: false,
          currentError: null
        },
        second: {
          done: false,
          currentError: null
        }
      },
      sending: false
    }),
    validations: {
      form: {
        firstName: {
          required,
          minLength: minLength(3)
        },
        lastName: {
          required,
          minLength: minLength(3)
        },
        email: {
          required,
          email
        },
        password: {
          required,
          minLength: minLength(8)
        },
      },
      personal: ['form.firstName', 'form.lastName'],
      account: ['form.email', 'form.password']
    },
    methods: {
      setDone (curr, next) {
          this.steps[curr].done = true
          this.active = next
      },
      getValidationClass (fieldName) {
        const field = this.$v.form[fieldName]

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
      tryRegister () {
        this.$store.commit('showLoading')

        axios.post(API_BASE_URL + '/register', this.getPostPayload())
        .then(this.successfullSignup)
        .catch(err => {
          console.log(err)
          this.sending = this.steps.first.done = false
          this.$store.commit('hideLoading')

          if (err.reponse && err.response.status === 418) {
            this.steps.first.currentError = 'E-mail already exists'
          } else {
            this.steps.first.currentError = 'Unknown API error, please try again later'
          }

          this.active = 'first'
        })
      },
      getPostPayload () {
        return {
          firstname: this.form.firstName,
          lastname: this.form.lastName,
          email: this.form.email,
          password: this.form.password
        }
      },
      successfullSignup (response) {
        const token = response.data.token
          this.sending = false
          this.$store.commit('login', this.getLoginPayload(token))
          this.$store.commit('hideLoading')
          this.$cookies.set(JWT_COOKIE_NAME, token)
          this.$router.replace('/')
      },
      getUserData () {
        let user = this.getPostPayload()

        delete user.password

        return user
      },
      getLoginPayload (token) {
        return {
          token: token,
          user: this.getUserData()
        }
      },
      validateUser () {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.tryRegister()
        }
      }
    },
    mounted () {
      this.$v.$touch
    }
  }
</script>

<style>
</style>

<template>
  <div class="md-layout md-alignment-center-center">
    <form novalidate class="md-layout-item md-xsmall-size-100 md-small-size-50 md-size-30" @submit.prevent="validate">
      <md-card class="md-flex-50 md-flex-small-100">
        <md-card-header>
          <div class="md-title">Login</div>
          <span class="md-error" v-if="error" style="color: red">Bad credentials</span>
        </md-card-header>

        <md-card-content>
            <md-field :class="getValidationClass('email')">
              <label for="identifier">Email</label>
              <md-input type="email" name="identifier" id="identifier" autocomplete="email" v-model="form.email" :disabled="sending" @input="$v.$touch"/>
              <span class="md-error" v-if="!$v.form.email.required">The email is required</span>
              <span class="md-error" v-else-if="!$v.form.email.email">Invalid email</span>
            </md-field>
            <md-field :class="getValidationClass('password')">
              <label for="password">Password</label>
              <md-input type="password" name="password" id="password" autocomplete="password" v-model="form.password" :disabled="sending" @input="$v.$touch"/>
              <span class="md-error" v-if="!$v.form.password.required">Password is required!</span>
            </md-field>
        </md-card-content>

        <md-card-actions>
          <md-button type="button" :disabled="sending" to="/register">Sign up</md-button>
          <md-button type="submit" class="md-primary md-raised" :disabled="sending">Login</md-button>
        </md-card-actions>
      </md-card>
    </form>
  </div>
</template>

<script>
  import { required, email } from 'vuelidate/lib/validators'
  import axios from 'axios'
  import { API_BASE_URL, JWT_COOKIE_NAME } from '../../config'

  export default {
    name: 'login',
    data: () => ({
      form: {
        email: null,
        password: null
      },
      sending: false,
      error: false
    }),
    validations: {
      form: {
        email: {
          required,
          email
        },
        password: {
          required
        }
      }
    },
    methods: {
      getValidationClass (fieldName) {
        const field = this.$v.form[fieldName]

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
      tryLogin () {
        this.sending = true
        this.$store.commit('showLoading')

        axios.post(API_BASE_URL + '/login', {
          identifier: this.form.email,
          password: this.form.password
        })
        .then(this.successfulLogin)
        .catch(err => {
          this.sending = false
          this.error = true
          this.$store.commit('hideLoading')
        })
      },
      successfulLogin (response) {
        this.sending = false
        this.$store.commit('hideLoading')
        this.$store.commit('login', {
          token: response.data.token,
          user: response.data.userData
        })
        this.$router.push('/')
        this.$cookies.set(JWT_COOKIE_NAME, response.data.token)
      },
      validate () {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.tryLogin()
        }
      }
    }
  }
</script>

<style>
</style>

<template>
  <div class="md-layout md-alignment-center-center">
    <form v-if="!$store.state.loading" novalidate class="md-layout-item md-xsmall-size-100 md-small-size-50 md-size-40" @submit.prevent="validate">
      <md-card class="md-flex-50 md-flex-small-100">
        <md-card-header>
          <div class="md-title">Edit "{{form.title}}"</div>
        </md-card-header>

        <md-card-content>
          <md-field :class="getValidationClass('title')">
            <label for="title">Title</label>
            <md-input name="identifier" id="title" v-model="form.title" :disabled="sending" @input="$v.$touch"/>
            <span class="md-error" v-if="!$v.form.title.required">The title is required</span>
          </md-field>
          <md-field>
            <label>Description</label>
            <md-textarea v-model="form.description" md-autogrow :disabled="sending"></md-textarea>
          </md-field>
        </md-card-content>

        <md-card-actions>
          <md-button type="button" :disabled="sending" to="/">Back</md-button>
          <md-button type="submit" class="md-primary md-raised" :disabled="sending">Save</md-button>
        </md-card-actions>
      </md-card>
    </form>
    <md-snackbar md-position="center" :md-duration="duration" :md-active.sync="showSnackbar" md-persistent>
      <span>{{snackbarMessage}}</span>
    </md-snackbar>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import http from '../../http'

export default {
  data: () => ({
    form: {
      title: '',
      description: ''
    },
    showSnackbar: false,
    snackbarMessage: '',
    duration: 2500,
    sending: false
  }),
  validations: {
    form: {
      title: {
        required
      }
    }
  },
  methods: {
    fetchData () {
      http.get(`/todo/${this.$route.params.id}`).then(response => {
        this.$store.commit('hideLoading')
        this.form.title = response.data.title
        this.form.description = response.data.description
      }).catch(err => {
        this.$store.commit('hideLoading')
        console.log(err)
      })
    },
    getValidationClass (fieldName) {
      const field = this.$v.form[fieldName]

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    validate () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.tryModify()
      }
    },
    tryModify () {
      http.put(`/todo/${this.$route.params.id}`, this.getUpdatePayload())
      .then(response => {
        this.$store.commit('hideLoading')
        this.snackbarMessage = 'Successfully saved.'
        this.showSnackbar = true
      }).catch(err => {
        this.$store.commit('hideLoading')
        this.snackbarMessage = "Can't saved. Try again later!"
        this.showSnackbar = true
        console.log(err)
      })
    },
    getUpdatePayload () {
      return {
        updateData: {
          title: this.form.title,
          description: this.form.description
        }
      }
    }
  },
  mounted () {
    this.$store.commit('showLoading')
    this.fetchData()
  }
}
</script>

<style>
</style>
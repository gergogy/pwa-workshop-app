<template>
  <div>
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Create ToDo</md-dialog-title>

      <form novalidate @submit.prevent="validate">
        <md-dialog-content>
          <md-field :class="getValidationClass('title')">
            <label for="title">Title</label>
            <md-input name="identifier" id="title" v-model="form.title" :disabled="sending" @input="$v.$touch"/>
            <span class="md-error" v-if="!$v.form.title.required">The title is required</span>
          </md-field>
          <md-field>
            <label>Description</label>
            <md-textarea v-model="form.description" md-autogrow :disabled="sending"></md-textarea>
          </md-field>
        </md-dialog-content>

        <md-dialog-actions>
          <md-button class="md-primary" type="button" @click="close">Cancel</md-button>
          <md-button class="md-primary" type="submit">Save</md-button>
        </md-dialog-actions>
      </form>
    </md-dialog>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import http from '../../http'

export default {
  name: 'create-todo',
  props: ['showDialog'],
  data: () => ({
    form: {
      title: '',
      description: ''
    },
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
        this.tryCreate()
      }
    },
    tryCreate () {
      this.$store.commit('showLoading')
      this.$store.dispatch('addTodo', this.getPostPayload()).then(res => {
        console.log(res)
        this.$emit('todo-created', this.getEventData(res))
      }, err => console.log(err))
    },
    getPostPayload () {
      return {
        insertData: {
          _id: this.mongoObjectId(),
          done: false,
          title: this.form.title,
          description: this.form.description
        }
      }
    },
    getEventData (id) {
      return {
        _id: id,
        title: this.form.title,
        description: this.form.description,
        done: false
      }
    },
    close () {
      this.form.title = ''
      this.form.description = ''
      this.$v.$reset()
      this.$emit('todo-created')
    },
    mongoObjectId () {
      const timestamp = (new Date().getTime() / 1000 | 0).toString(16)
      return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16).toLowerCase())
    }
  }
}
</script>

<style>
</style>
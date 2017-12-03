<template>
  <div>
    <md-list-item md-expand>
      <md-checkbox v-model="done" @change="modifyState"/>
      <span class="md-list-item-text">{{title}}</span>

      <md-button class="md-icon-button" :to="getTodoUri()">
        <md-icon class="md-accent">&#xE3C9;</md-icon>
      </md-button>
      <md-button class="md-icon-button" @click.native="deletePermanently">
        <md-icon style="color: red">&#xE92B;</md-icon>
      </md-button>

      <md-list slot="md-expand">
        <div v-if="description" class="md-list-item-content">{{description}}</div>
        <div v-else style="padding: 0 8px">
          <md-icon style="color: orange">&#xE002;</md-icon>
          <span>No description</span>
        </div>
      </md-list>
    </md-list-item>
  </div>
</template>

<script>
import http from '../../http'

export default {
  name: 'todo-list-item',
  props: {
    id: String,
    done: Boolean,
    title: String,
    description: String
  },
  methods: {
    getTodoUri () {
      return `/todo/${this.id}`
    },
    modifyState () {
      this.$store.commit('showLoading')

      http.put(this.getTodoUri(), this.getStatePayload())
      .then(response => {
        this.$store.commit('hideLoading')
      })
      .catch(err => {
        this.$store.commit('hideLoading')
        console.log(err)
      })
    },
    getStatePayload () {
      return {
        updateData: {
          done: this.done
        }
      }
    },
    deletePermanently () {
      http.delete(this.getTodoUri(), this.getStatePayload())
      .then(response => {
        this.$store.commit('hideLoading')
        this.$emit('todo-deleted', this.id)
      })
      .catch(err => {
        this.$store.commit('hideLoading')
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.md-list-item-content {
  white-space: pre-wrap;
}
</style>
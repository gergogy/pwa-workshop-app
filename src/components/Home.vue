<template>
  <div>
    <div class="md-layout md-alignment-center-center">
      <div class="md-layout-item md-size-50">
        <div v-if="!loading && sortedTodos.length" class="md-layout-item">
          <md-list>
            <todo-list-item v-for="todo in sortedTodos" :key="todo._id" :id="todo._id" :title="todo.title" :done="todo.done" :description="todo.description" @todo-deleted="onDelete"/>
          </md-list>
        </div>
        <empty-state v-else-if="!loading"></empty-state>
      </div>
    </div>

    <create-todo :showDialog.sync="createDialog" @todo-created="onCreate"/>
    <md-button @click="showDialog" class="md-fab md-fab-bottom-right">
      <md-icon>&#xE145;</md-icon>
    </md-button>
    <md-snackbar md-position="center" :md-duration="duration" :md-active.sync="showSnackbar" md-persistent>
      <span>{{snackbarMessage}}</span>
    </md-snackbar>
  </div>
</template>

<script>
import http from '../http'
import EmptyState from './misc/EmptyState'
import TodoListItem from './todo/ListItem'
import CreateTodo from './todo/Create'

export default {
  name: 'home',
  data: () => ({
    loading: false,
    showSnackbar: false,
    snackbarMessage: '',
    duration: 2500,
    createDialog: false
  }),
  computed: {
    sortedTodos: function () {
      return this.$store.getters.getTodos
    }
  },
  components: { EmptyState, TodoListItem, CreateTodo },
  mounted () {
    this.$store.dispatch('getTodos')
  },
  methods: {
    showDialog () {
      this.createDialog = true
    },
    onCreate (todo) {
      if (todo) {
        this.snackbarMessage = `"${todo.title}" successfully created`
        this.showSnackbar = true
      }

      this.createDialog = false
    },
    onDelete (todo) {
      if (todo) {
        this.snackbarMessage = `"${todo.title}" successfully deleted`
        this.showSnackbar = true
      }
    }
  }
}
</script>
<template>
  <div>
    <div class="md-layout md-alignment-center-center">
      <div class="md-layout-item md-size-50">
        <div v-if="!loading && todos.length" class="md-layout-item">
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
    todos: [],
    loading: true,
    showSnackbar: false,
    snackbarMessage: '',
    duration: 2500,
    createDialog: false
  }),
  computed: {
    sortedTodos: function () {
      return this.todos.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      })
    }
  },
  components: { EmptyState, TodoListItem, CreateTodo },
  mounted () {
    this.$store.commit('showLoading')
    this.fetchTodos()
  },
  methods: {
    showDialog () {
      this.createDialog = true
    },
    fetchTodos () {
      this.loading = true

      http.get('/todo').then(response => {
        this.$store.commit('hideLoading')
        this.todos = response.data
        this.loading = false
      }).catch(err => {
        this.$store.commit('hideLoading')
        this.loading = false

        if (err.response.status !== 404) {
          console.log(err)
        }
      })
    },
    onCreate (todo) {
      this.todos.push(todo)
      this.snackbarMessage = `"${todo.title}" successfully created`
      this.showSnackbar = true
    },
    onDelete (id) {
      let index;

      this.todos.forEach((todo, i) => {
        if (todo._id === id) {
          this.snackbarMessage = `"${todo.title}" successfully deleted`
          this.showSnackbar = true
          index = i
        }
      })

      if (Number.isInteger(index)) {
        this.todos.splice(index, 1)
      }
    }
  }
}
</script>
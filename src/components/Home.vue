<template>
  <div>
    <div class="md-layout md-alignment-center-center">
      <div class="md-layout-item md-size-50">
        <md-button v-if="hasNotifications" :disabled="hasPermission" @click="getPermission" class="md-raised md-accent">Request Permission</md-button>
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
import Notifications from '../notifications'

export default {
  name: 'home',
  data: () => ({
    loading: false,
    showSnackbar: false,
    snackbarMessage: '',
    duration: 2500,
    createDialog: false,
    hasNotifications: false,
    notificationsHandler: undefined,
    hasPermission: false
  }),
  computed: {
    sortedTodos: function () {
      return this.$store.getters.getTodos
    }
  },
  components: { EmptyState, TodoListItem, CreateTodo },
  mounted () {
    const hasNotifications = 'Notification' in window

    this.$store.dispatch('getTodos')
    this.hasNotifications = hasNotifications

    this.hasPermission = hasNotifications
      && Notification.permission === 'granted'

    if (hasNotifications) {
      this.notificationsHandler = new Notifications()
    }
  },
  methods: {
    getPermission () {
      if (this.hasNotifications) {
        this.notificationsHandler.requestPermission()
          .then(
            () => {
              this.hasPermission = true

              this.notificationsHandler.displayNotification({
                swReg: this.$store.getters.getSwReg,
                title: 'First notification',
                body: "BO...DY",
                icon: '/static/images/android-icon-144x144.png',
                data: {
                  first: true
                },
                actions: [
                  {action: 'wtf', title: 'wtf'},
                  {action: 'close', title: 'Close'},
                ]
              })
              console.log('Permission granted')
            },
            e => console.log('Permission denied', e)
          )
      }
    },
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
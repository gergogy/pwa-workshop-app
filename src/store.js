import Vue from 'vue'
import Vuex from 'vuex'
import DB from './db'
import http from './http'

Vue.use(Vuex)

const getTodoUri = id => `/todo/${id}`

export default new Vuex.Store({
  state: {
    token: false,
    user: undefined,
    loading: false,
    todos: [],
    swReg: undefined
  },
  getters: {
    getSwReg (state) {
      return state.swReg
    },
    getTodos (state) {
      return state.todos.sort((a, b) => {
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
  mutations: {
    login (state, payload) {
      state.token = payload.token
      state.user = payload.user
    },
    logout (state) {
      state.token = false
      state.user = undefined
    },
    showLoading (state) {
      state.loading = true
    },
    hideLoading (state) {
      state.loading = false
    },
    setTodos (state, todos) {
      state.todos = todos
    },
    updateTodo (state, data) {
      state.todos.forEach((t,i) => {
        if (t._id === data.id) {
          Object.keys(data.payload.updateData).forEach(key => {
            state.todos[i][key] = data.payload.updateData[key]
          })
        }
      })
    },
    addTodo (state, todo) {
      state.todos.push(todo)
    },
    removeTodo (state, id) {
      state.todos.forEach((t,i) => {
        if (t._id === id) {
          state.todos.splice(i, 1)
        }
      })
    },
    purgeTodos (state) {
      state.todos = []
    },
    setSwReg (state, swReg) {
      state.swReg = swReg
      console.log('mutation', state.swReg)
    }
  },
  actions: {
    getTodos ({commit}) {
      commit('showLoading')

      http.get('/todo').then(response => {
        commit('hideLoading')

        DB.allDocs().then(result => {
          // Promise isn't supported by all browsers; you may want to use bluebird
          return Promise.all(result.rows.map(row => {
            return DB.remove(row.id, row.value.rev);
          }));
        }).then(() => {
          console.log('DB purged')

          if (response.data.length) {
            response.data.forEach(todo => {
              DB.put(todo)
                .then(r => console.log('db put', r))
                .catch(e => {
                  if (e.status !== 409) console.error('error', e)
                })
            })

            commit('setTodos', response.data)
          } else {
            commit('setTodos', response.data)
          }
        }).catch(err => {
          console.log(err)
        });
      }).catch(err => {
        console.log(err)
        if (!err.response || err.response.status !== 404) {
          commit('purgeTodos')

          DB.allDocs()
            .then(r => {
              console.log('db fetch', r)
              let todos = []

              r.rows.forEach(row => {
                DB.get(row.id).then(doc => {
                  delete doc._rev
                  commit('addTodo', doc)
                })
              })
              commit('hideLoading')
            })
            .catch(e => {
              console.err('error', e)
              commit('setTodos', [])
            })
        } else {
          commit('setTodos', [])
        }
      })
    },
    addTodo ({commit}, todo) {
      commit('showLoading')
      return new Promise((res, rej) => {
        DB.put(todo.insertData)
          .then(r => console.log('db put', r))
          .catch(e => {
            if (e.status !== 409) console.error('error', e)
          })

        http.post('/todo', todo).then(response => {
          commit('hideLoading')
        }).catch(err => {
          commit('hideLoading')
          console.log(err)
        })

        commit('addTodo', todo.insertData)

        res(todo.insertData._id)
      })
    },
    removeTodo ({commit}, id) {
      console.log(id)
      commit('showLoading')
      DB.get(id).then(doc => {
        return DB.remove(doc._id, doc._rev);
      })

      http.delete(getTodoUri(id))
        .then(response => {
          commit('hideLoading')
        })
        .catch(err => {
          commit('hideLoading')
          console.log(err)
        })

      commit('removeTodo', id)
      commit('hideLoading')
    },
    updateTodo ({commit}, data) {
      commit('showLoading')

      http.put(getTodoUri(data.id), data.payload)
        .then(response => {
          commit('hideLoading')
        })
        .catch(err => {
          commit('hideLoading')
          console.log(err)
        })

      commit('updateTodo', data)

      let doc = data.payload.updateData

      DB.get(data.id).then(d => {

        Object.keys(d).forEach(key => {
          if (!doc.hasOwnProperty(key)) {
            doc[key] = d[key]
          }
        })

        return DB.put(doc);
      }).then(response => {
        console.log('updated')
      }).catch(function (err) {
        console.log(err);
      });
    },
    getTodo ({commit, state}, id) {
      commit('showLoading')

      return new Promise((res, rej) => {
        let found;

        state.todos.forEach(todo => {
          if (todo._id === id) {
            found = todo
          }
        })

        commit('hideLoading')

        if (found) {
          res(found)
        } else {
          rej('hiba')
        }
      })
    }
  }
})
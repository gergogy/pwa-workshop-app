<template>
  <div class="page-container">
    <md-progress-bar v-if="$store.state.loading" md-mode="indeterminate" class="md-accent" />
    <custom-cookie-law/>
    <md-app md-waterfall md-mode="fixed-last">
      <md-app-toolbar class="md-primary">
        <div class="md-toolbar-row">
          <div class="md-toolbar-section-start">
            <md-button v-if="$store.state.token && $store.state.user" class="md-icon-button" @click="menuVisible = !menuVisible">
              <md-icon>&#xE5D2;</md-icon>
            </md-button>

            <span class="md-title">Ultimate ToDo List</span>
            <div class="md-toolbar-section-end">
              <md-button v-if="this.$store.state.token" @click.prevent="logout">Logout</md-button>
              <md-button class="md-raised md-accent" v-else to="/login">Login/Sign up</md-button>
            </div>
          </div>
        </div>
      </md-app-toolbar>

      <md-app-drawer v-if="$store.state.token && $store.state.user" :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">Navigation</md-toolbar>

        <md-list>
          <md-list-item to="/">
            <md-icon>&#xE896;</md-icon>
            <span class="md-list-item-text">My ToDos</span>
          </md-list-item>
          <md-list-item @click="logout">
            <md-icon>&#xE8AC;</md-icon>
            <span class="md-list-item-text">Logout</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view></router-view>
      </md-app-content>
    </md-app>
  </div>
</template>

<style lang="sass">
@import "../node_modules/vue-material/dist/theme/engine";

@include md-register-theme("default", (primary: md-get-palette-color(orange, 500), accent: md-get-palette-color(blue, 500), theme: light));
@include md-register-theme("selection-red", (accent: md-get-palette-color(red, 500), theme: light));

@import "../node_modules/vue-material/dist/theme/all";


.md-progress-bar
  height .2em
</style>

<script>
import CustomCookieLaw from './components/misc/CustomCookieLaw'
import { API_BASE_URL, JWT_COOKIE_NAME } from './config'
import axios from 'axios'

export default {
  name: 'app',
  data: () => ({
    menuVisible: false
  }),
  components: { CustomCookieLaw },
  methods: {
    autoLogin () {
      const cookieToken = this.$cookies.get(JWT_COOKIE_NAME)

      if (cookieToken && cookieToken.length) {
        this.$store.commit('showLoading')

        axios.get(API_BASE_URL + '/api/tokenLogin', {
          headers: {Authorization: `Bearer ${cookieToken}`}
        })
        .then(response => {
          this.$store.commit('hideLoading')
          this.$cookies.set(JWT_COOKIE_NAME, response.data.token)
          this.$store.commit('login', {
            token: response.data.token,
            user: response.data.userData
          })
          this.$router.push("/")
        })
        .catch(err => {
          this.$store.commit('hideLoading')
          //this.$cookies.remove(JWT_COOKIE_NAME)
        })
      }
    },
    logout () {
      this.menuVisible = false
      this.$store.commit('logout')
      this.$router.replace('/login')
      this.$cookies.remove(JWT_COOKIE_NAME)
    },
    installServiceWorker () {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
          }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
        });
      }
    }
  },
  mounted () {
    this.installServiceWorker()
    this.autoLogin()
  },
}
</script>

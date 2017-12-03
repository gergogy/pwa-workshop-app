import { API_BASE_URL } from './config'
import axios from 'axios'
import store from './store'

const instance = axios.create({baseURL: API_BASE_URL + '/api'})

instance.interceptors.request.use(config => {
  if (store.state.token) {
    config.headers.Authorization = `Bearer ${store.state.token}`
  }

  return config
})

export default instance
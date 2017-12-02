import { API_BASE_URL } from '../config'
import axios from 'axios'
import store from './store'

export default axios.create({
  baseURL: API_BASE_URL + '/api',
  headers: {
    Authorization: `Bearer ${store.token}`
  }
})
import Vue from 'vue'
import PouchDB from 'pouchdb'

let db = new PouchDB('todos')

export default db
import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import * as types from './mutation-types'
import { StoreFront, Catalog } from '../contracts'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const range = n => Array.from({length: n}, (value, key) => key)

const rootState = {
  account: '',
  balance: '0',
  admin: false,
  newAdmin: '',
  productId: 0,
  productPrice: 0,
  productAvailable: 0,
  catalogAddress: '',
  products: []
}

const getters = {
  account: state => state.account,
  balance: state => state.balance,
  admin: state => state.admin,
  newAdmin: state => state.newAdmin,
  productId: state => state.productId,
  productPrice: state => state.productPrice,
  productAvailable: state => state.productAvailable,
  catalogAddress: state => state.catalogAddress,
  products: state => state.products
}

const actions = {
  // action is dispatched when account is first set
  // this is where you can put your initialization calls
  setAccount ({ commit, dispatch, state }, account) {
    console.log('account: ' + account)
    commit(types.UPDATE_ACCOUNT, account)

    StoreFront.deployed().then(instance => {
      console.log('account: ' + account)
      instance.admins(account).then(isAdmin => {
        commit(types.UPDATE_ADMIN, isAdmin)
      })
      return instance.catalog()
    }).then(catalogAddress => {
      commit(types.UPDATE_CATALOG, catalogAddress)
      dispatch('loadProducts')
    })
  },
  updateAccount ({ commit, dispatch, state }, account) {
    commit(types.UPDATE_ACCOUNT, account)
    StoreFront.deployed().then(instance => {
      console.log('update account: ' + account)
      console.log('admin?: ' + instance.admins(account))
      instance.admins(account).then(isAdmin => {
        commit(types.UPDATE_ADMIN, isAdmin)
      })
    })
  },
  loadProducts ({ commit, dispatch, state }) {
    commit(types.CLEAR_PRODUCTS)
    Catalog.at(state.catalogAddress).then(catalogInstance => {
      catalogInstance.numProducts().then(numProducts => {
        console.log('numproducts: ' + numProducts)
        range(numProducts).forEach(n => {
          console.log('time: ' + n)
          catalogInstance.productIds(n).then(productId => {
            console.log('productId: ' + productId)
            catalogInstance.products(productId).then((payload) => {
              console.log(payload)
              commit(
                types.ADD_PRODUCT,
                {
                  id: productId.toString(),
                  price: payload[0],
                  available: payload[1],
                  exists: payload[2],
                  active: payload[3]
                }
              )
            })
          })
        })
      })
    })
  }
}

const mutations = {
  // this mutatation is called when the route changes
  [types.ROUTE_CHANGED] (state, { to, from }) {
    console.log('route changed from', from.name, 'to', to.name)
  },
  [types.UPDATE_ACCOUNT] (state, account) {
    state.account = account
  },
  [types.UPDATE_CATALOG] (state, address) {
    state.catalogAddress = address
  },
  [types.UPDATE_ADMIN] (state, isAdmin) {
    state.admin = isAdmin
  },
  [types.CLEAR_PRODUCTS] (state) {
    state.products = []
  },
  [types.ADD_PRODUCT] (state, product) {
    console.log(product)
    if (product.active) {
      state.products.push(product)
    }
  }
}

export default new Vuex.Store({
  state: rootState,
  getters,
  actions,
  mutations,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

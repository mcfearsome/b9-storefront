<template>
  <div class="storefront">
    <header>
      <img width="100" src="../assets/logo.png">
      <h1>StoreFront</h1>
    </header>

    <section>
      <h1>Products</h1>
      <ul id='products'>
        <li v-for='product in products'>
          ID: {{ product.id }}
          <br>
          Price: {{ product.price }}
          <br>
          Available: {{ product.available }}
        </li>
      </ul>
    </section>

    <footer>
      <span class="hint"><strong>Hint:</strong> open the browser developer console to view any errors and warnings.</span>
    </footer>
  </div>
</template>


<script>
import { mapGetters } from 'vuex'
// import * as types from '../store/mutation-types'

export default {
  name: 'catalog',
  computed: {
    ...mapGetters({
      account: 'account',
      balance: 'balance',
      admin: 'admin',
      products: 'products'
    })
  }
}
</script>

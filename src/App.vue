<template>
  <div id="app">
 
    <hea message="HAKKIMIZDA"/>
    <router-view></router-view>
  
      <alt/>
      <scrollUp/>

  </div>
</template>

<script>
  import hea from './components/hea.vue'
  import alt from './components/alt.vue'
  import scrollUp from './components/scrollUp.vue'
  import CartList from './components/cart/CartList';
  import ProductList from './components/product/ProductList';
  import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

  export default {
    components:{
      hea,
      alt,
      scrollUp,
      CartList,
      ProductList
    }
  }
</script>
<style>
  #app {
    background: url("components/img/general_bg_image.png") repeat;
    margin: 0;
    color: #333;
    font-size: 12px;
    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
  }
</style>

<template>
  <div>
    <ele-header :seller="seller"></ele-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import axios from 'axios'
  import header from './components/header/header.vue'
  const OK = 0
  export default {

    data () {
      return {
        // seller: null // 有问题
        seller: {}
      }
    },

    created () {
      // 使用vue-resource发送ajax请求express提供的接口
      /*this.$http.get('/api/seller')
        .then(response => {
          const result = response.body
          if (result.code===OK) {
            this.seller = result.data
            console.log('vue-resource', this.seller)
          }
        })*/
      // 使用axios发送ajax请求mockjs提供的接口
      setTimeout(() => {
        axios.get('/api2/seller')
            .then(response => {
            const result = response.data
            if (result.code===OK) {
            this.seller = result.data
            this.seller.score = 3.6
            console.log('axios3', this.seller)
          }
        })
        .catch(error => {
            console.log(error)
        })
      }, 1000)
    },

    components: {
      'ele-header': header
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/mixins.styl"

  .tab
    height 40px
    line-height 40px
    display: flex
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      flex 1
      font-size 14px
      color rgb(77,85,93)
      text-align center
      .active
        color: red
</style>

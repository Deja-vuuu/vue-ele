<template>
  <div>
    <div class="shopcart">

      <div class="content">
        <div class="content-left" @click="toogleList">
          <div class="logo-wrapper">
            <div class="logo" :class="{highlight: totalCount>0}">
              <i class="icon-shopping_cart" :class="{highlight: totalCount>0}"></i>
            </div>
            <div class="num" v-if="totalCount">{{totalCount}}</div>
          </div>
          <div class="price">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click="pay">
          <div class="pay" :class="totalPrice<minPrice?'not-enough':'enough'">
            {{payText}}
          </div>
        </div>
      </div>

      <div class="ball-container">
        <transition name="drop" v-for="(ball, index) in balls" :key="index"
                    @before-enter="beforeDrop"
                    @enter="dropping"
                    @after-enter="afterDrop"
                    v-bind:css="false">
          <div class="ball"  v-show="ball.isShow">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>

      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="clearCart">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in foodList">
                <span class="name">{{food.name}}/{{food.count}}个</span>
                <div class="price"><span>￥{{food.price}}</span></div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" :update-food-count="updateFoodCount"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>

    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="toogleList"></div>
    </transition>

  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import Vue from 'vue'
  import cartcontrol from '../cartcontrol/cartcontrol.vue'

  export default {
    props: {
      foodList: Array,
      deliveryPrice: Number,
      minPrice: Number,
      clearCart: Function,
      updateFoodCount: Function
    },

    data () {
      return {
        isShow: false,
        balls: [
          {isShow: false},
          {isShow: false},
          {isShow: false},
          {isShow: false},
          {isShow: false}
        ],
        droppingBalls: []  // 保存多个执行动画的ball
      }
    },



    computed: {
      totalCount () {
        return this.foodList.reduce((preTotal, food) => {
          return preTotal + food.count
        }, 0)
      },
      totalPrice () {
        return this.foodList.reduce((preTotal, food) => {
          return preTotal + food.count * food.price
        }, 0)
      },
      payText () {
        var minPrice = this.minPrice
        var totalPrice = this.totalPrice

        if (totalPrice === 0) {
          return `￥${minPrice}元起送`
        } else if (totalPrice < minPrice) {
          return `还差￥${minPrice - totalPrice}元起送`
        } else {
          return '去结算'
        }
      },

      listShow () {
        if(this.totalCount==0) {
          this.isShow = false
          return false
        }

        // 如果是显示的状态
        if(this.isShow) {
          Vue.nextTick(() => {
            if(!this.scroll) { // 保存只创建一次
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              })
            } else {// 不是第一次
              this.scroll.refresh() // 刷新一个滚动(如果高度大于容器元素的高度, 形成滚动条)
            }

          })

        }

        return this.isShow
      }
    },

    methods: {
      toogleList () {
        this.isShow = !this.isShow
      },

      /*
      让一个隐藏的小球启动一个显示的动画
       */
      drop (startEl) {
        // 找到隐藏的小球
        const ball = this.balls.find(ball => !ball.isShow)
        // 显示它
        if(ball) {
          ball.isShow = true
          ball.startEl = startEl
          this.droppingBalls.push(ball)
        }
      },

      /*
      指定el的起始位置
       */
      beforeDrop (el) {
        console.log('before()', Date.now())
        // 找到对应的ball
        const ball = this.droppingBalls.shift() // 移除第一个

        var offsetY = 0
        var offsetX = 0
        // 计算
        const {left, top} = ball.startEl.getBoundingClientRect()
        const elLeft = 32
        const elBottom = 22
        offsetX = left - elLeft
        offsetY = -(window.innerHeight - top - elBottom)

        // 指定transform样式
        el.style.transform = `translate3d(0, ${offsetY}px, 0)`
        el.children[0].style.transform = `translate3d(${offsetX}px, 0, 0)`

        // 保存ball
        el.ball = ball
      },

      /*
      指定el的结束位置
       */
      dropping (el) {
        // 强制重排重绘
        var temp = el.clientHeight
        console.log('dropping()', Date.now())
        // 异步指定
        this.$nextTick(() => {
          // 指定transform样式
          el.style.transform = 'translate3d(0, 0, 0)'
          el.children[0].style.transform = 'translate3d(0, 0, 0)'
        })
      },
      /*
      隐藏el
       */
      afterDrop (el) {
        console.log('afterDrop()', Date.now())
        // 必须延迟更新状态
        setTimeout(() => {
          el.ball.isShow = false
        }, 400)
      },

      pay() {
        if(this.totalPrice>=this.minPrice) {
          alert(`支付${this.totalPrice+this.deliveryPrice}`)
        }
      }
    },

    components: {
      cartcontrol
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"

  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0) /*显示时的状态*/
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-active
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>
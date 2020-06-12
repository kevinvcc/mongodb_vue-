<template>
  <div class="s-cart">
    <div class="cart-cont">
      <ul>
        <li class="cont-one" v-for="(cart, index) in carts">
          <!--左侧内容-->
          <input class="goods-checkbox" type="checkbox" v-model="cart.cart_isSelect" @click="clickSelect(cart)">
          <a class="goods-a" href="javascript:;">
            <img class="goods-img" :src="cart.brand_pic">
          </a>

          <!--中间内容-->
          <div class="goods-info">
            <h5 class="goods-name" style="margin-left: 20px;">{{cart.brand_name}}</h5>
            <div class="goods-counter">
              <a href="javascript:;" class="btn-sub" @click="changeNum(-1, cart)"> - </a>
              <input type="text" class="goods-num" readonly="readonly" v-model.lazy="cart.cart_num">
              <a href="javascript:;" class="btn-add" @click="changeNum(1, cart)"> + </a>
            </div>
          </div>

          <!--右侧内容-->
          <span class="goods-price">￥{{cart.brand_price*cart.cart_num}}</span>
          <a class="goods-delete" href="javascript:;" @click="delectCart(index, carts, cart.brand_id)">删除</a>
        </li>
        <h3 v-if="this.carts.length===0" style="text-align: center;margin-top: 10px;">购物车为空</h3>
      </ul>
    </div>

    <!--底部内容-->
    <div class="cart-counter">
      <div class="all-checkbox">
        <input type="checkbox" name="all-goods" class="all-goods" v-model="isAllSelectState" @click="clickAllSelect">
        <label for="all-goods">全选</label>
      </div>
      <div class="all-price">
        <p class="price-p">总计 :<em class="price">￥{{totalNowPrice}}</em></p>
      </div>
      <a class="btn-counter">去结算</a>
    </div>
  </div>
</template>

<script>
  import Jam from '../com/jam'
  import LocalDB from '../com/localDB'

  export default {
    data () {
      return {
        dataCart: {},
        carts: {},
        isAllSelectState: false,
        name: '', // 用户名
        jam: function () {}
      }
    },
    created () {
      this.$store.dispatch('changeHeaderTitle', '购物车')
      // todo 1. 判断是否登录
      this.jam = new Jam()
      if (this.jam.locDbGet('dataLogin')) {
        this.name = this.jam.locDbGet('dataLogin').name
        this.getDataCart()
      } else {
        // 弹窗未登录，去登录，router
        this.$toast({
          message: '未登录！'
        })
        this.$router.push({path: '/center'})
      }
    },
    computed: {
      totalNowPrice () {
        let price = 0
        // this.carts.forEach(cart => {    // 可以执行，但是报错this.carts.forEach is not a function
        Array.from(this.carts).forEach(cart => {
        // [...this.carts].forEach(cart => {   //SyntaxError: Unexpected token
          if (cart.cart_isSelect) {
            price += cart.brand_price * cart.cart_num
          }
        })
        return price
      }
    },
    methods: {
      showSideBar () {
        return this.$store.dispatch('changeSideBarState', true)
      },
      hideSideBar () {
        return this.$store.dispatch('changeSideBarState', false)
      },
      getDataCart () {
  //     todo 2. 按照用户名， 查询该用户购物车中的所有商品信息
        this.$http({
          url: '/api/goods/carts',
          method: 'GET',
          params: {
            name: this.name
          }
        })
          .then((res) => {
            let data = res.data
            console.log(data)
            if (data.code === 200) {
              console.log(data.msg)
              this.dataCart = data
              this.carts = data.data
            } else {
              console.log(data.msg)
            }
          })
      },
      changeNum (change, cart) {
        if (change === -1) {
          if (cart.cart_num >= 2) {
            cart.cart_num = cart.cart_num - 1
          }
        } else {
          cart.cart_num = cart.cart_num + 1
        }
      },
      clickSelect (cart) { // 单选
        cart.cart_isSelect = !cart.cart_isSelect  // 没有这个，数据没及时同步到全选
        let isAllSelectState = Array.from(this.carts).every(cart => {
          return cart.cart_isSelect
        })
        this.isAllSelectState = isAllSelectState
      },
      clickAllSelect () { // 全选
        this.isAllSelectState = !this.isAllSelectState
        Array.from(this.carts).forEach(cart => {
        // [...this.carts].forEach(cart => {   //SyntaxError: Unexpected token
          cart.cart_isSelect = this.isAllSelectState
        })
      },
      delectCart (index, carts, brandId) {
        // index: 第几个商品；carts: Obj; barndId: 商品的id
        // todo 1) 从数据库删除该商品
        this.$http({
          url: '/api/goods/delectCart',
          method: 'GET',
          params: {
            brand_id: brandId,
            name: this.name
          }
        })
          .then((res) => {
            let data = res.data
            if (data.code === 200) {
              // todo 2) 删除成功
              this.$toast.success(data.msg)
              carts.splice(index, 1)  // 删除购物车列表里这个商品
              // todo 3) 将购物车中的商品保存到本地
              let localDB = new LocalDB('dataCart')
              this.dataCart.data.carts = this.carts
              localDB.set(this.dataCart)
            } else {
              this.$toast.success(data.msg)
            }
          })
      }
    }
  }
</script>

<style lang="scss" scope>
  @import '../../css/cart.scss';

</style>

<template>
  <div class="s-index">
    <!--轮播图-->
    <comSwiper></comSwiper>

    <div class="cont">
      <p class="cont-head">
        <span class="head-title">特卖</span>
        <router-link to="/cate" class="head-right">更多 ></router-link>
      </p>
      <div class="cont-main cont-temai">
        <!--todo 动态路由-->
        <router-link class="cont-one" href="javascript:;" v-for="(brand,index) in temai" :to="'detail/'+brand.brand_id" :key="brand.index">
          <span class="name">{{brand.brand_name}}</span>
          <span class="price">￥{{brand.brand_price}}</span>
          <img class="pic" v-lazy="brand.brand_pic"/>
        </router-link>
      </div>
    </div>

    <div class="cont">
      <p class="cont-head">
        <span class="head-title">热销</span>
        <router-link to="/cate" class="head-right">更多 ></router-link>
      </p>
      <div class="cont-main cont-rexiao">
        <router-link :to="'detail/'+brand.brand_id" class="cont-left" href="javascript:;"
            v-for="(brand, key, index) in rexiao"
            v-if="key==0"
            :key="brand.id">
          <span class="name">{{brand.brand_name}}</span>
          <span class="desc">{{brand.brand_desc}}</span>
          <!--<img class="pic" :src="brand.brand_pic"/>-->
          <img class="pic" v-lazy="brand.brand_pic"/>
        </router-link>
        <div class="cont-right">
          <router-link :to="'detail/'+brand.brand_id" class="cont-right-one" href="javascript:;"
              v-for="(brand, key, index) in rexiao"
              v-if="key>=1"
              :key="brand.id">
            <p class="text">
              <span class="name">{{brand.brand_name}}</span>
              <span class="desc">{{brand.brand_desc}}</span>
            </p>
            <img class="pic" v-lazy="brand.brand_pic"/>
          </router-link>
        </div>
      </div>
    </div>

    <div class="cont">
      <p class="cont-head">
        <span class="head-title">精品</span>
        <router-link to="/cate" class="head-right">更多 ></router-link>
      </p>
      <div class="cont-main cont-jingpin">
        <ul>
          <li v-for="brand in jingpin">
            <router-link :to="'detail/'+brand.brand_id" class="cont-li" href="javascript:;">
              <img class="pic" v-lazy="brand.brand_pic"/>
              <span class="name" >{{brand.brand_name}}</span>
              <span class="price" >￥{{brand.brand_price}}</span>
            </router-link>
          </li>
          <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading" spinner="default">
            <div slot="no-more" >
              没有更多数据了
            </div>
          </infinite-loading>
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
  import comSwiper from '../com/swiper'
  import InfiniteLoading from 'vue-infinite-loading'
  import '../../css/index.scss'

  export default {
    data () {
      return {
        dataIndex: {},
        temai: [],
        rexiao: [],
        jingpin: []
      }
    },
    components: {
      comSwiper: comSwiper,
      InfiniteLoading: InfiniteLoading
    },
    created () {
      this.$store.dispatch('changeHeaderTitle', '首页') // dispatch 到 store中的actions()
      this.getDataIndex()
    },
    methods: {
      showSideBar () {
        return this.$store.dispatch('changeSideBarState', true)
        // return this.$store.commit('changeSideBarState', true)
      },
      hideSideBar () {
        return this.$store.dispatch('changeSideBarState', false)
      },
      getDataIndex () {
        this.$http({
          url: '/api/goods/index',
          method: 'GET'
        })
          .then((res) => {
            let data = res.data
            console.log(data)
            if (data.code === 200) {
              // 处理数据
              this.temai = data.data.temai
              this.rexiao = data.data.rexiao
              this.jingpin = data.data.jingpin
            } else {
              console.log(data.msg)
            }
          })
      },
      onInfinite () {  // 无线加载的情况
        this.$http({
          url: '/api/goods/index/jingpin',
          method: 'GET',
          params: {
            nowLength: this.jingpin.length
          }
        })
          .then((res) => {
            let data = res.data
            let newJingpin = data.data
            console.log(data)
            if (data.code === 200) {
              // 处理数据
              this.jingpin = this.jingpin.concat(newJingpin)
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
              if (newJingpin.length === 0) {
                this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
              }
            } else {
              console.log(data.msg)
            }
          })
      }
    }
  }
</script>

<style lang="scss" scope>

</style>

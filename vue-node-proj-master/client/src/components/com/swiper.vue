<template>
  <div class="s-swiper">
    <Swipe class="s-swipe">
      <SwipeItem class="slide"><img src="http://s18.mogucdn.com/mlcdn/c45406/170713_3k1jbhjk7ia22a5dbejc4lid7gcl8_750x390.jpg_800x9999.v1c7E.70.webp"/></SwipeItem>
      <SwipeItem class="slide"><img src="http://s11.mogucdn.com/mlcdn/c45406/170714_25kl4cag98idhc57328dj12lc908g_750x390.jpg_800x9999.v1c7E.70.webp"/></SwipeItem>
      <SwipeItem class="slide"><img src="https://s10.mogucdn.com/mlcdn/c45406/180926_45fkj8ifdj4l824l42dgf9hd0h495_750x390.jpg"/></SwipeItem>
    </Swipe>
  </div>
</template>

<script>
  import { Swipe, SwipeItem } from 'vue-swipe'
  import 'vue-swipe/dist/vue-swipe.css'
  export default {
    data () {
      return {}
    },
    components: {
      Swipe,
      SwipeItem
    },
    computed: {
      headerTitle () {
        return this.$store.getters.getHeaderTitle
      }
    },
    methods: {
      showSideBar () {
        return this.$store.dispatch('changeSideBarState', true)
        // return this.$store.commit('changeSideBarState', true)
      },
      hideSideBar () {
        return this.$store.dispatch('changeSideBarState', false)
      }
    }
  }
</script>

<style lang="scss" scope>
  .s-swiper{
    height: 6rem;
    width: 16rem;
  }
  .slide{
    background: #EEEEEE;
    img{
      width: 16rem;
      height: 6rem;
    }
  }
</style>

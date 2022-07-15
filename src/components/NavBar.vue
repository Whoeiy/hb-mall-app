
<template>
  <div class="nav-bar van-hairline--top">
    <ul class="nav-list">
      <router-link  class="nav-list-item active" to="home">
        <i class="nbicon nblvsefenkaicankaoxianban-1"></i>
        <span>首页</span>
      </router-link>
      <router-link  class="nav-list-item" to="category">
        <i class="nbicon nbfenlei"></i>
        <span>分类</span>
      </router-link>
      <router-link  class="nav-list-item" to="cart">
        <van-icon  name="shopping-cart-o" :badge="!count ? '' : count" />
        <span>购物车</span>
      </router-link>
      <router-link  class="nav-list-item" to="forum">
        <img src="../assets/activity.jpg" class="nav-icon1">
        <span>活动</span>
      </router-link>
      <router-link  class="nav-list-item" to="user">
        <i class="nbicon nblvsefenkaicankaoxianban-"></i>
        <span>我的</span>
      </router-link>
    </ul>
  </div>
</template>

<script>

import {onMounted, computed, reactive} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import { useStore } from 'vuex'
import { getLocal } from '@/common/js/utils'
export default {
  setup() {
    const route = useRoute()
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      isLogin: false,
      loading: true
    })
    onMounted(() => {
      const token = getLocal('token')
      const path = route.path
      if (token && !['/home', '/category','/forum'].includes(path)) {
        if (token) {
        state.isLogin = true
        store.dispatch('updateCart')}
        else{
          router.push({path: `/Login`})
        }
      }

    })
    const count = computed(() => {
      return store.state.cartCount
    })

    return {
      count
    }
  }
}
</script>

<style lang="less" scoped >
    @import '../common/style/mixin';
    .nav-bar{
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: 5px 0;
      z-index: 1000;
      background: #fff;
      transform: translateZ(0);
      -webkit-transform: translateZ(0);
      .nav-list {
        width: 100%;
        .fj();
        flex-direction: row;
        padding: 0;
        .nav-list-item {
          display: flex;
          flex: 1;
          flex-direction: column;
          text-align: center;
          color: #666;
          &.router-link-active {
            color: @primary;
          }
          .nav-icon1{
            width:21px;
            display: flex;
            flex: 1;
            flex-direction: column;
            padding-left: 29px;

          }
          i {
            text-align: center;
            font-size: 22px;
          }
          span{
            font-size: 12px;
          }
          .van-icon-shopping-cart-o {
            margin: 0 auto;
            margin-bottom: 2px;
          }
        }
      }
    }

</style>
padding: 5px;
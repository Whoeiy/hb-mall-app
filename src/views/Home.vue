

<template>
  <div>
    <header class="home-header wrap" :class="{'active' : headerScroll}">
      <router-link tag="i" to="./label"><i class="nbicon nbmenu2"></i></router-link>
      <div class="header-search">
        <span class="app-name">HeartBeat365</span>
        <i class="iconfont icon-search"></i>
        <router-link tag="span" class="search-title" to="./product-list?from=home">搜索心仪礼品</router-link>
      </div>
      <router-link class="login" tag="span" to="./login" v-if="!isLogin">登录</router-link>
      <router-link class="login" tag="span" to="./user" v-else>
        <van-icon name="manager-o" />
      </router-link>
    </header>
    <nav-bar />
    <swiper :list="swiperList"></swiper>
    <div class="label-list">
      <div v-for="item in labelList" v-bind:key="item.labelId" @click="tips">
        <img  :src="item.imgUrl">
        <span>{{item.name}}</span>
      </div>
    </div>
    <div class="good">
      <header class="good-header">新品上线</header>
      <van-skeleton title :row="3" :loading="loading">
        <div class="good-box">
          <div class="good-item" v-for="item in newGifts" :key="item.giftId" @click="goToDetail(item)">
            <img :src="$filters.prefix(item.giftCoverImg)" alt="">
            <div class="good-desc">
              <div class="title">{{ item.giftName }}</div>
              <div class="price">¥ {{ item.originalPrice }}</div>
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>
    <div class="good">
      <header class="good-header">热门商品</header>
      <van-skeleton title :row="3" :loading="loading">
        <div class="good-box">
          <div class="good-item" v-for="item in hots" :key="item.giftId" @click="goToDetail(item)">
            <img :src="$filters.prefix(item.giftCoverImg)" alt="">
            <div class="good-desc">
              <div class="title">{{ item.giftName }}</div>
              <div class="price">¥ {{ item.originalPrice }}</div>
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>
    <div class="good" :style="{ paddingBottom: '100px'}">
      <header class="good-header">最新推荐</header>
      <van-skeleton title :row="3" :loading="loading">
        <div class="good-box">
          <div class="good-item" v-for="item in recommends" :key="item.giftId" @click="goToDetail(item)">
            <img :src="$filters.prefix(item.giftCoverImg)" alt="">
            <div class="good-desc">
              <div class="title">{{ item.giftName }}</div>
              <div class="price">¥ {{ item.originalPrice }}</div>
            </div>
          </div>
        </div>
      </van-skeleton>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import swiper from '@/components/Swiper'
import navBar from '@/components/NavBar'
import { getHome } from '@/service/home'
import { getLocal } from '@/common/js/utils'
import { Toast } from 'vant'
import { useStore  } from 'vuex'
export default {
  name: 'home',
  components: {
    swiper,
    navBar
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      swiperList: [], // 轮播图列表
      isLogin: false, // 是否已登录
      headerScroll: false, // 滚动透明判断
      hots: [],
      newGifts: [],
      recommends: [],
      labelList: [
        {
          name: '特殊节日',
          imgUrl: 'https://igpgift.com/image/cache/images/showcase/banner/4682_600x315.jpg',
         labelId: 8
        }, {
          name: '送给谁',
          imgUrl: 'https://igpgift.com/image/cache/images/showcase/banner/4471_600x315.jpg',
       labelId:53
        }, {
          name: '纪念礼物',
          imgUrl: 'https://igpgift.com/image/cache/images/showcase/banner/4934_600x315.jpg',
         labelId: 14
        }, {
          name: '节日礼物',
          imgUrl: 'https://igpgift.com/image/cache/images/showcase/banner/2284_600x315.jpg',
        labelId:20
        }
      ],
      loading: true
    })
    onMounted(async () => {
      const token = getLocal('token')
      if (token) {
        state.isLogin = true
        // 获取购物车数据.
        store.dispatch('updateCart')
      }
      Toast.loading({
        message: '加载中...',
        forbidClick: true
      });
      const { data } = await getHome()
      state.swiperList = data.carousels
      state.newGifts = data.newGifts
      state.hots = data.hotGifts
      state.recommends = data.recommendGifts
      state.loading = false
      Toast.clear()
    })

    nextTick(() => {
      window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        scrollTop > 100 ? state.headerScroll = true : state.headerScroll = false
      })
    })

    const goToDetail = (item) => {
      router.push({ path: `/product/${item.giftId}` })
    }

    const tips = () => {
      router.push({ path: `/label` })
    }

    return {
      ...toRefs(state),
      goToDetail,
      tips
    }
  },
}
</script>

<style lang="less" scoped >
  @import '../common/style/mixin';
  .home-header {
     // position: fixed;
      left: 0;
      top: 0;
      .wh(100%, 50px);
      .fj();
      line-height: 50px;
      padding: 0 15px;
      .boxSizing();
      font-size: 15px;
      color: #fff;
      z-index: 10000;
      .nbmenu2 {
        color: @primary;
      }
      &.active {
        background: @primary;
        .nbmenu2 {
          color: #fff;
        }
        .login {
          color: #fff;
        }
      }

      .header-search {
          display: flex;
          .wh(74%, 20px);
          line-height: 20px;
          margin: 10px 0;
          padding: 5px 0;
          color: #232326;
          background: rgba(255, 255, 255, .7);
          border-radius: 20px;
          .app-name {
              padding: 0 10px;
              color: @primary;
              font-size: 20px;
              font-weight: bold;
              border-right: 1px solid #666;
          }
          .icon-search {
              padding: 0 10px;
              font-size: 17px;
          }
          .search-title {
              font-size: 12px;
              color: #666;
              line-height: 21px;
          }
      }
      .icon-iconyonghu{
        color: #fff;
        font-size: 22px;
      }
      .login {
        color: @primary;
        line-height: 52px;
        .van-icon-manager-o {
          font-size: 20px;
          vertical-align: -3px;
        }
      }
  }
  .label-list {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    width: 100%;
    padding-bottom: 13px;
    div {
      display: flex;
      flex-direction: column;
      width: 50%;
      text-align: center;
      img {
        .wh(150px, 100px);
        margin: 13px auto 8px auto;
      }
    }
  }
  .good {
    .good-header {
      background: #f9f9f9;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: @primary;
      font-size: 16px;
      font-weight: 500;
    }
    .good-box {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .good-item {
        box-sizing: border-box;
        width: 50%;
        border-bottom: 1PX solid #e9e9e9;
        padding: 10px 10px;
        img {
          display: block;
          width: 120px;
          margin: 0 auto;
        }
        .good-desc {
          text-align: center;
          font-size: 14px;
          padding: 10px 0;
          .title {
            color: #222333;
          }
          .price {
            color: @primary;
          }
        }
        &:nth-child(2n + 1) {
          border-right: 1PX solid #e9e9e9;
        }
      }
    }
  }
  .floor-list {
      width: 100%;
      padding-bottom: 50px;
      .floor-head {
        width: 100%;
        height: 40px;
        background: #F6F6F6;
      }
      .floor-content {
        display: flex;
        flex-shrink: 0;
        flex-wrap: wrap;
        width: 100%;
        .boxSizing();
        .floor-category {
          width: 50%;
          padding: 10px;
          border-right: 1px solid #dcdcdc;
          border-bottom: 1px solid #dcdcdc;
          .boxSizing();
          &:nth-child(2n) {
            border-right: none;
          }
          p {
            font-size: 17px;
            color: #333;
            &:nth-child(2) {
              padding: 5px 0;
              font-size: 13px;
              color: @primary;
            }
          }
          .floor-products {
            .fj();
            width: 100%;
            img {
              .wh(65px, 65px);
            }
          }
      }
    }
  }
</style>


<template>
  <div class="product-detail">
    <s-header :name="'商品详情'"></s-header>
    <div class="detail-content">
      <div class="detail-swipe-wrap">
            <img class="product-img"  v-if="detail.imgUrl" :src="$filters.prefix(detail.imgUrl)"/>
      </div>
      <div class="product-info">
        <div class="product-title">
          {{ detail.giftName || '' }}
        </div>
        <div class="product-desc">免邮费 顺丰快递</div>
        <div class="product-price">
          <span>¥{{ detail.originalPrice || '' }}</span>
<!--          <span style="color:#FF6B01">会员¥{{ detail.vipPrice || '' }}</span>-->
          <span>礼品库存{{ detail.stockNum || '' }}</span>
        </div>
      </div>
      <div class="product-intro">
<!--        <ul>-->
<!--          <li>概述</li>-->
<!--          <li>参数</li>-->
<!--          <li>安装服务</li>-->
<!--          <li>常见问题</li>-->
<!--        </ul>-->
        <div class="product-content" v-html="detail.giftIntro || ''"></div>
        <van-button round style="color: #F63515; float:right ;margin-right: 8px" @click="recommend()" >一键推荐 </van-button>
      </div>
    </div>
    <van-action-bar>
      <van-action-bar-icon icon="chat-o" text="客服" />
      <van-action-bar-icon icon="cart-o" :badge="!count ? '' : count" @click="goTo()" text="购物车" />
      <van-action-bar-button type="warning" @click="handleAddCart" text="加入购物车" />
      <van-action-bar-button type="danger" @click="goToCart" text="立即购买" />
    </van-action-bar>
  </div>
</template>

<script>
import { reactive, onMounted, computed, toRefs, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getDetail } from '@/service/good'
import {addCart, Recommend} from '@/service/cart'
import sHeader from '@/components/SimpleHeader'
import { Toast } from 'vant'
// import { prefix } from '@/common/js/utils'
export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const state = reactive({
      detail: {
        // goodsCarouselList: []
      }
    })

    onMounted(async () => {
      const { id } = route.params
      const { data } = await getDetail(id)
      // data.goodsCarouselList = data.goodsCarouselList.map(i => prefix(i))
      state.detail = data
      store.dispatch('updateCart')
    })

    nextTick(() => {
      // 一些和DOM有关的东西
      const content = document.querySelector('.detail-content')
      content.scrollTop = 0
    })

    const goBack = () => {
      router.go(-1)
    }

    const goTo = () => {
      router.push({ path: '/cart' })
    }

    const handleAddCart = async () => {
      const { resultCode } = await addCart({ count: 1, giftId: state.detail.giftId, price: state.detail.originalPrice })
      if (resultCode == 200 ) Toast.success('添加成功')
      store.dispatch('updateCart')
    }

    const goToCart = async () => {
      await addCart({ count: 1, giftId: state.detail.giftId, price: state.detail.originalPrice })
      store.dispatch('updateCart')
      router.push({ path: '/cart' })
    }
    const  recommend = async () =>{
  const { id } = route.params
 await Recommend(id)
    }

    const count = computed(() => {
      console.log(111, store.state.count)
      return store.state.count
    })

    return {
      ...toRefs(state),
      goBack,
      goTo,
      handleAddCart,
      goToCart,
      count,
      recommend
    }
  },
  components: {
    sHeader
  }
}
</script>

<style lang="less">
  @import '../common/style/mixin';
  .product-detail {
    .detail-header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10000;
      .fj();
      .wh(100%, 44px);
      line-height: 44px;
      padding: 0 10px;
      .boxSizing();
      color: #252525;
      background: #fff;
      border-bottom: 1px solid #dcdcdc;
      .product-name {
        font-size: 14px;
      }
    }
    .detail-content {
      height: calc(100vh - 50px);
      overflow: hidden;
      overflow-y: auto;
      .detail-swipe-wrap {
        .my-swipe .van-swipe-item {
          img {
            width: 100%;
            // height: 300px;
          }
        }
      }
      .product-img{
        padding: 10px 10px;
        width: 100%;
      }
      .product-info {
        padding: 0 10px;
        .product-title {
          font-size: 18px;
          text-align: left;
          color: #333;
        }
        .product-desc {
          font-size: 14px;
          text-align: left;
          color: #999;
          padding: 5px 0;
        }
        .product-price {
          .fj();
          span:nth-child(1) {
            color: #F63515;
            font-size: 22px;
          }
          span:nth-child(2) {
            color: #999;
            font-size: 16px;
          }
        }
      }
      .product-intro {
        width: 100%;
        padding-bottom: 50px;
        ul {
          .fj();
          width: 100%;
          margin: 10px 0;
          li {
            flex: 1;
            padding: 5px 0;
            text-align: center;
            font-size: 15px;
            border-right: 1px solid #999;
            box-sizing: border-box;
            &:last-child {
              border-right: none;
            }
          }
        }
        .product-content {
          padding: 0 20px;
          img {
            width: 100%;
          }
        }
      }
    }
    .van-action-bar-button--warning {
      background: linear-gradient(to right,@primary, #FF6B01)
    }
    .van-action-bar-button--danger {
      background: linear-gradient(to right, @primary, #FF6B01)
    }
  }
</style>

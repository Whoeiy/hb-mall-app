<template>
  <div class="cart-box">
    <s-header :name="detail.customerName" :noback="faulse"></s-header>
  <div class="detail-content">

    <div class="detail-swipe-wrap">

      <img style="width: 100%;border-radius:10px;"  v-if="detail.imgUrl" :src="$filters.prefix(detail.imgUrl)"/><br>
    </div>
    <div class="product-info">
      <br>
      <div style=" font-size: 20px;
        font-weight: bold;
        text-align: left;
        padding-left: 20px;">
        {{ detail.title || '' }}
      </div>
<br>
      <div style="padding-left: 20px;font-size: 16px;padding-right: 20px;">

        <span>{{ detail.postContent || '' }}</span>
      </div>
      <div style="font-size: 18px;float: right;padding-right: 20px"> {{ detail.likeCount }} </div>


      <img v-if="detail.isLiked == 0" src="../assets/heart1.jpg" style="width: 18px ; float: right;margin: 3px 8px 0px 0px " @click="Like">
      <img v-else  src="../assets/heart2.jpg" style="width: 18px ; float: right;margin: 3px 8px 0px 0px " @click="unLike">

    </div>
    </div>
    <van-action-bar>

      <van-action-bar-button type="warning" @click="goBack()" text="返回" />

    </van-action-bar>
  </div>
</template>

<script>
import sHeader from "@/components/SimpleHeader";
import {useRoute, useRouter} from "vue-router";

import {nextTick, onMounted, reactive, toRefs} from "vue";
import {getPostDetail,  likePost} from "@/service/activity";
import {Toast} from "vant";

export default {
  name: "PostDetail",
  components: {
    sHeader,
  },


  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      detail: {
      },
      list:[],
      likeStatus:'1',
    })

    onMounted(async () => {
      const { id } = route.query
      const { data } = await getPostDetail(id)

      state.detail = data
      state.list = state.list.concat(data);
    })

    nextTick(() => {
      // 一些和DOM有关的东西
      const content = document.querySelector('.detail-content')
      content.scrollTop = 0
    })

    const goBack = () => {
      router.go(-1)
    }


    const Like = async () => {
      const { id } = route.query;
      const {
        data,

      } = await likePost({ postId: id, likeStatus: state.likeStatus });
      state.totalPage = data.totalPage;
      state.postId=state.detail.postId;
      state.detail.isLike='1';
      state.detail.likeCount = state.detail.likeCount +1;
      state.loading = false;
      if (state.page >= data.totalPage) state.finished = true;
      Toast.clear();

    };

    const unLike = async () => {
      const { id } = route.query;
      state.likestatus='0';
      const {
        data,

      } = await likePost({ postId: id, likeStatus: 0 });
      state.totalPage = data.totalPage;
      state.postId=state.detail.postId;

      state.detail.isLike='0';
      state.detail.likeCount = state.detail.likeCount - 1;
      state.loading = false;
      if (state.page >= data.totalPage) state.finished = true;
      Toast.clear();
    };

    return {
      ...toRefs(state),
      goBack,
      Like,
      unLike,
    }
},}
</script>

<style lang="less">
@import '../common/style/mixin';
.cart-box {
  .cart-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    .fj();
    .wh(100%, 44px);
    line-height: 44px;
    padding: 0 10px;
    .boxSizing();
    background: #fff;

    .cart-name {
      font-size: 14px;
    }
  }
}
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
}
</style>
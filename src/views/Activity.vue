<template>
  <div class="cart-box">
    <s-header :name="'活动详情'" :noback="faulse"></s-header>
    <div class="detail-content">
      <div style="margin: 10px 10px 10px 10px">
        <img
          style="width: 100%; border-radius: 10px; border: 10px"
          v-if="detail.posterUrl"
          :src="$filters.prefix(detail.posterUrl)"
        />
      </div>
      <div style="margin: 10px 10px 10px 10px">
        <div style="font-size: 18px; font-weight: bold; text-indent: 2px">
          {{ detail.activityDetail || "" }}
        </div>
        <div style="margin: 10px 10px 5px 5px">
          <span style="font-weight: bold"
            >活动时间：{{ formatDate(detail.startTime) || "" }}-{{
              formatDate(detail.endTime) || ""
            }}</span
          >
          <br />
          <span style="font-weight: bold" v-for="item in list" :key="item"
            >优惠券：{{ item.coupon.couponName }}</span
          ><br />
          <span
            style="color: chocolate; font-size: 14px"
            @click="goToRanking(detail.activityId)"
            >>>排行榜</span
          >
        </div>
      </div>
      <div class="good">
        <header class="good-header">帖子</header>
        <van-skeleton title :row="3" :loading="loading">
          <div class="good-box">
            <div
              class="good-item"
              v-for="item in postdetail"
              :key="item.postId"
              @click="goToDetail(item.postId)"
            >
              <img
                style="border-radius: 2px"
                :src="$filters.prefix(item.imgUrl)"
                alt="帖子"
              />
              <div class="good-desc">
                <div class="title">{{ item.title }}By{{ item.customerName }} </div>
               <div style="font-size: 18px;float: right"> {{ item.likeCount }} </div>


                <img v-if="item.isLiked == 0" src="../assets/heart1.jpg" style="width: 18px ; float: right;margin: 3px 8px 0px 0px " @click="Like">
                  <img v-else src="../assets/heart2.jpg" style="width: 18px ; float: right;margin: 3px 8px 0px 0px ">


                <img
                  v-if="item.isLiked == 0"
                  src="../assets/heart1.jpg"
                  style="width: 18px; float: right; margin: 3px 8px 0px 0px"
                />
                <img
                  v-if="item.isLiked == 1"
                  src="../assets/heart2.jpg"
                  style="width: 18px; float: right; margin: 3px 8px 0px 0px"
                />
              </div>
            </div>
          </div>
        </van-skeleton>

        <van-action-bar>
          <van-action-bar-button
            type="warning"
            @click="goTo(detail.activityId)"
            text="发布我的帖子"
          />
        </van-action-bar>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, onActivated } from "vue";
import sHeader from "@/components/SimpleHeader";
import {
  getActivityDetail, getPostList, likePost
} from "@/service/activity";


import { Dialog, Toast } from "vant";
import { useRoute, useRouter } from "vue-router";
export default {
  name: "Activity",
  components: {
    sHeader,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      detail: {},
      list: [],
      postlist: [],
      postdetail: [],
      showPay: false,
      page: 1,
      pageSize: 10,
      totalPage: 0,
      activityId: "",
      seclectActive: false,
      refreshing: false,
      loading: false,
      finished: false,
      postId:"",
      likeStatus:'1',
    });

    onMounted(() => {
      init();
      loadData();
    });
    onActivated(() => {
      init();
      loadData();
      location.reload();
    });

    const init = async () => {
      Toast.loading({
        message: "加载中...",
        forbidClick: true,
      });
      const { id } = route.query;
      const { data } = await getActivityDetail(id);

      state.detail = data;
      state.list = state.list.concat(data);

      Toast.clear();
    };
    const goTo = (id) => {
      router.push({ path: "/post", query: { id } });
    };
    const goToRanking = (id) => {
      router.push({ path: "/ranking", query: { id } });
    };

    const loadData = async () => {
      const { id } = route.query;
      const {
        data,
        data: { list },
      } = await getPostList({
        pageNum: state.page,
        pageSize: state.pageSize,
        activityId: id,
      });

      state.postlist = state.postlist.concat(data);
      state.postdetail = state.postdetail.concat(list);
      state.totalPage = data.totalPage;
      state.postId = state.postlist.postId;
      state.loading = false;
      if (state.page >= data.totalPage) state.finished = true;
    };
    const close = () => {
      Dialog.close();
    };
    const formatDate = (value) => {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;

      return y + "-" + MM + "-" + d + " ";
    };
    const onLoad = () => {
      if (!state.refreshing && state.page < state.totalPage) {
        state.page = state.page + 1;
      }
      if (state.refreshing) {
        state.productList = [];
        state.refreshing = false;
      }
      init()
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

    };

    const onRefresh = () => {
      state.refreshing = true;
      state.finished = false;
      state.loading = true;
      state.page = 1;
      onLoad();
    };

    const goToDetail = (id) => {
      router.push({ path: "/postdetail", query: { id } });
    };

    return {
      ...toRefs(state),
      goTo,
      close,
      formatDate,
      loadData,
      goToDetail,
      onLoad,
      onRefresh,
      Like,
      goToRanking

    };
  },
};
</script>

<style lang="less">
@import "../common/style/mixin";
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
  .content {
    height: calc(~"(100vh - 70px)");
    overflow: hidden;
    overflow-y: scroll;
    margin-top: 0px;
  }
  .order-list-refresh {
    .van-card__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .van-pull-refresh__head {
    }
    .order-item-box {
      margin: 20px 10px;
      background-color: #fff;
      .order-item-header {
        padding: 10px 20px 0 20px;
        display: flex;
        justify-content: space-between;
      }
      .van-card {
        background-color: #fff;
        margin-top: 0;
      }
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
    .product-img {
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
          color: #f63515;
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
    background: linear-gradient(to right, @primary, #ff6b01);
  }
  .van-action-bar-button--danger {
    background: linear-gradient(to right, @primary, #ff6b01);
  }
}
.good {
  .good-header {
    background: #f9f9f9;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #ff6b01;
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
      border-bottom: 1px solid #e9e9e9;
      padding: 10px 10px;
      img {
        display: block;
        width: 120px;
        margin: 0 auto;
      }
      .good-desc {
        text-align: left;
        font-size: 14px;
        padding: 10px 0;
        .title {
          color: #222333;
        }
        .price {
          color: @primary;
          text-align: right;
        }
      }
    }
  }
}
</style>

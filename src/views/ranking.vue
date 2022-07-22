<template>
  <div class="address-edit-box">
    <s-header :name="'排行榜'"></s-header>
    <div v-if="data.customerRank == 0">
      <van-notice-bar mode="link">您的帖子未上榜，快去发帖吧~</van-notice-bar>
    </div>
    <div v-if="data.customerRank != 0 && data.couponId == null">
      <van-notice-bar mode="link"
        >您的帖子获赞数最高排名第{{ data.customerRank }}位~</van-notice-bar
      >
    </div>
    <div v-if="data.customerRank != 0 && data.couponId != null">
      <van-notice-bar mode="link" @click="goToCoupon()"
        >您的帖子获赞数最高排名第1位，点击领取奖品~</van-notice-bar
      >
    </div>
    <div v-for="(item, index) in rankingList" :key="index" class="ranking-item">
      <span>{{ index + 1 }}</span>
      <div>{{ item.title }}</div>
      <div style="font-size: 5px">{{ item.customerName }}</div>
    </div>
  </div>
</template>

<script>
import { toRefs, reactive, onMounted } from "vue";
//import { Toast } from "vant";
import sHeader from "@/components/SimpleHeader";

import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

import { getRankingList, getCoupon } from "@/service/activity";
export default {
  components: {
    sHeader,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { id } = route.query;
    console.log(id);
    const state = reactive({
      rankingList: [],
      data: {},
    });

    onMounted(() => {
      init();
    });

    const init = async () => {
      const { data } = await getRankingList(id);
      //   const { data } = await getRankingList(12);
      //   console.log(data);
      state.data = data;
      console.log(state.data);
      state.rankingList = data.items;
      //console.log(state.rankingList);
    };

    const goToCoupon = () => {
        getCoupon({
            couponId: state.data.couponId,
            channel: parseInt(id)
        })
        router.push({ path: "/coupon" });
    };

    return {
      ...toRefs(state),
      goToCoupon,
    };
  },
};
</script>

<style lang="less">
@import "../common/style/mixin";
.edit {
  .van-field__body {
    textarea {
      height: 26px !important;
    }
  }
}
.address-edit-box {
  .van-address-edit {
    .van-button--danger {
      background: @primary;
      border-color: @primary;
    }
    .van-switch--on {
      background: @primary;
    }
  }
  .ranking-item {
    font-size: 15px;
    margin: 20px 30px;
    padding: 10px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0);
    border-radius: 10px;
    box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.3);
  }
}
</style>


<template>
  <div class="cart-box">
    <s-header :name="'活动中心'" :noback="faulse"></s-header>
    <div class="content">
      <van-pull-refresh
          v-model="refreshing"
          @refresh="onRefresh"
          class="order-list-refresh"
      >
        <van-list
            v-model:loading="loading"
            :finished="finished"
            @load="onLoad"
            @offset="0"
        >
          <div
              v-for="(item, index) in list"
              :key="index"
              class="order-item-box"
              @click="goTo(item.activityId)"
          >
            <img :src="$filters.prefix(item.posterUrl)" alt="活动海报" style="width:100%;border-radius:10px; margin: 0 auto">
            <div class="order-item-header">
<!--              <span>{{ item.activityName }}</span>-->
              <span style="font-size:12px">{{ item.activityDetail }}</span>

            </div>

            <van-card
                v-for="one in item.list"
                :key="one.activityId"

                :title="one.activityName"
                :thumb="$filters.prefix(one.posterUrl)"
            />
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import sHeader from "@/components/SimpleHeader";
import { getForum } from "@/service/activity";
import { useRouter } from "vue-router";

export default {
  name: "Forum",
  components: {
    sHeader,
  },
  setup() {
    const router = useRouter();
    const state = reactive({
      status: "",
      loading: false,
      finished: false,
      refreshing: false,
      list: [],
      page: 1,
      pageSize: 10,
      totalPage: 0,
    });

    const loadData = async () => {
      const {
        data,
        data: { list },
      } = await getForum({ pageNum: state.page, pageSize: state.pageSize });
      state.list = state.list.concat(list);
      state.totalPage = data.totalPage;
      state.loading = false;
      if (state.page >= data.totalPage) state.finished = true;
    };

    const onChangeTab = (name) => {
      // 这里 Tab 最好采用点击事件，@click，如果用 @change 事件，会默认进来执行一次。
      state.status = name;
      onRefresh();
    };

    const goTo = (id) => {
      router.push({ path: "/activity", query: { id } });
    };

    const goBack = () => {
      router.go(-1);
    };

    const onLoad = () => {
      if (!state.refreshing && state.page < state.totalPage) {
        console.log(state.page);
        console.log(state.totalPage);
        state.page = state.page + 1;
      }
      if (state.refreshing) {
        state.list = [];
        state.refreshing = false;
      }
      loadData();
    };

    const onRefresh = () => {
      state.refreshing = true;
      state.finished = false;
      state.loading = true;
      state.page = 1;
      onLoad();
    };

    return {
      ...toRefs(state),
      onChangeTab,
      goTo,
      goBack,
      onLoad,
      onRefresh,
    };
  },
};
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
</style>

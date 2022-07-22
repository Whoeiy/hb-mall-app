

<template>
  <div class="product-list-wrap">
    <div class="product-list-content">
      <header class="category-header wrap">
        <i class="nbicon nbfanhui" @click="goBack"></i>
        <div class="header-search">
          <i class="nbicon nbSearch"></i>
          <input
            type="text"
            class="search-title"
            v-model="keyword"/>
        </div>
        <span class="search-btn" @click="getSearch">搜索</span>
      </header>
<!--      <div style="padding-left: 30px" v-show="true">-->
<!--        <a herf="" style="cursor: default;padding-right: 10px">历史记录</a>-->
<!--        <a style="padding-right: 10px; font-size: 14px; " v-for="(item,index) in brief" :key="index" >{{item}}</a>-->
<!--      </div>-->





      <van-tabs type="card" color="#FF3001" @click="changeTab" >
        <van-tab title="价格升序" name="3"></van-tab>
        <van-tab title="最新礼品" name="1"></van-tab>
        <van-tab title="价格降序" name="2"></van-tab>
      </van-tabs>
    </div>
    <div class="content">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="product-list-refresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          :finished-text="productList.length ? '没有更多了' : '搜索想要的商品'"
          @load="onLoad"
          @offset="10"
        >
           <p v-for="item in list" :key="item">{{ item }}</p>
          <template v-if="productList.length">
            <div class="product-item" v-for="(item, index) in productList" :key="index" @click="productDetail(item)">
              <img :src="item.imgUrl" />
              <div class="product-info">
                <p class="name">{{item.giftName}}</p>
                <p class="subtitle">{{item.giftIntro}}</p>
                <span class="price">￥ {{item.originalPrice}}</span>
              </div>
            </div>
          </template>
          <img class="empty" v-else src="https://s.yezgea02.com/1604041313083/kesrtd.png" alt="搜索">
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { search } from '@/service/good'
import {Toast} from "vant";


export default {

  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      keyword: route.query.keyword || '',
      searchBtn: false,
      seclectActive: false,
      refreshing: false,
      list: [],
      loading: false,
      finished: false,
      productList: [],
      totalPage: 0,
      page: 1,
      sortBy:'3',
      pageSize: 10,
      searchType:'3',
    })

    // onMounted(() => {
    //   init()
    // })

    const init = async () => {
      const { categoryName } = route.query
      const { labelName }=route.query
      if (!categoryName && !state.keyword && !labelName) {
        Toast.fail('请输入关键词')
        state.finished = true
        state.loading = false;
        return
      }
      if(!categoryName && !labelName) {

        // const { data, data: {list} } = await search({ keyword: state.keyword})
        const {data} = await search({
          keyword: state.keyword,
          sortBy: state.sortBy,
          pageNum: state.page,
          pageSize: state.pageSize
        })

        state.productList = state.productList.concat(data)
        state.totalPage = data.totalPage
        state.loading = false;
        if (state.page >= data.totalPage) state.finished = true
      }
      else if(!categoryName && labelName!==""){
        const {data} = await search({
          keyword: labelName,
          sortBy: state.sortBy,
          pageNum: state.page,
          pageSize: state.pageSize
        })

        state.productList = state.productList.concat(data)
        state.totalPage = data.totalPage
        state.loading = false;
        if (state.page >= data.totalPage) state.finished = true
      }
      else {
        const {data} = await search({
          keyword: categoryName,
          sortBy: state.sortBy,
          pageNum: state.page,
          pageSize: state.pageSize
        })

        state.productList = state.productList.concat(data)
        state.totalPage = data.totalPage
        state.loading = false;
        if (state.page >= data.totalPage) state.finished = true
      }

    }

    const goBack = () => {
      router.go(-1)
    }

    const productDetail = (item) => {
      router.push({ path: `/product/${item.giftId}` })
    }

    const getSearch = () => {

      onRefresh()
    }

    const onLoad = () => {
      if (!state.refreshing && state.page < state.totalPage) {
        state.page = state.page + 1
      }
      if (state.refreshing) {
        state.productList = [];
        state.refreshing = false;
      }
      init()
    }

    const changeTab = (name) => {
      console.log('name', name)
      state.sortBy = name
      onRefresh()
    }

    const onRefresh = () => {
      state.refreshing = true
      state.finished = false
      state.loading = true
      state.page = 1
      onLoad()
    }



    return {
      ...toRefs(state),
      goBack,
      productDetail,
      getSearch,
      changeTab,
      onLoad,
      onRefresh,
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../common/style/mixin';
  .product-list-content {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1000;
    background: #fff;
    .category-header {
      .fj();
      width: 100%;
      height: 50px;
      line-height: 50px;
      padding: 0 15px;
      .boxSizing();
      font-size: 15px;
      color: #656771;
      z-index: 10000;
      &.active {
        background: @primary;
      }
      .icon-left {
        font-size: 25px;
        font-weight: bold;
      }
      .header-search {
        display: flex;
        width: 76%;
        height: 20px;
        line-height: 20px;
        margin: 10px 0;
        padding: 5px 0;
        color: #232326;
        background: #F7F7F7;
        .borderRadius(20px);
        .nbSearch {
          padding: 0 5px 0 20px;
          font-size: 17px;
        }
        .search-title {
          font-size: 12px;
          color: #666;
          background: #F7F7F7;
        }
    }
    .icon-More {
      font-size: 20px;
    }
    .search-btn {
      height: 28px;
      margin: 8px 0;
      line-height: 28px;
      padding: 0 5px;
      color: #fff;
      background: @primary;
      .borderRadius(5px);
      margin-top: 10px;
    }
  }
}
  .content {
    height: calc(~"(100vh - 70px)");
    overflow: hidden;
    overflow-y: scroll; 
    margin-top: 78px;
  }
  .product-list-refresh {
    .product-item {
      .fj();
      width: 100%;
      height: 120px;
      padding: 10px 0;
      border-bottom: 1px solid #dcdcdc;
      img {
        width: 140px;
        height: 120px;
        padding: 0 10px;
        .boxSizing();
      }
      .product-info {
          width: 56%;
          height: 120px;
          padding: 5px;
          text-align: left;
          .boxSizing();
          p {
            margin: 0
          }
          .name {
            width: 100%;
            max-height: 40px;
            line-height: 20px;
            font-size: 15px;
            color: #333;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .subtitle {
            width: 100%;
            max-height: 20px;
            padding: 10px 0;
            line-height: 25px;
            font-size: 13px;
            color: #999;
            overflow: hidden;
          }
          .price {
            color: @primary;
            font-size: 16px;
          }
      }
  }
  .empty {
    display: block;
    width: 150px;
    margin: 50px auto 20px;
  }
}
</style>

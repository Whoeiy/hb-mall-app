

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
        <span class="search-btn" slot="append" @click="getSearch">搜索</span>
        <p style="display: inline-block;">
            <span v-for="(item, index) in searchHistoryList" :key="index" style="float:right; margin: 0 10px;">{{ item }}</span><!-- 右浮动实现从左往右删除数组 -->
        </p>
        <p>tip:获取并展示输入的词语,最多6个词语</p>

      


      </header>
      <van-tabs type="card" color="#FF6B01" @click="changeTab">
        <van-tab title="推荐" name=""></van-tab>
        <van-tab title="新品" name="new"></van-tab>
        <van-tab title="价格" name="price"></van-tab>
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
          <!-- <p v-for="item in list" :key="item">{{ item }}</p> -->
          <template v-if="productList.length">
            <div class="product-item" v-for="(item, index) in productList" :key="index" @click="productDetail(item)">
              <img :src="$filters.prefix(item.imgUrl)" />
              <div class="product-info">
                <p class="name">{{item.giftName}}</p>
                <p class="subtitle">{{item.giftIntro}}</p>
                <span class="price">￥ {{item.vipPrice}}</span>
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

export default {
    data () {
        return {
            searchGoods: '',
            searchHistoryList: []
        }
    },
    created() {
        this.getSearchHistory()
    },
    methods: {
        searchHistory(searchGoods){
            if (this.searchHistoryList.length > 5) {  // 最多搜索6个,超出则删除一个数组元素
                this.searchHistoryList.splice(0,1) // 删除索引值为0的数组元素
                this.searchHistoryList.push(searchGoods) // 添加到数组末尾
                this.$cookies.set('searchHistoryList', this.searchHistoryList) // 写入cookies
                // this.$cookies.remove('searchHistoryList') // 移除cookies
            } else { // 不超出则直接添加
                this.searchHistoryList.push(searchGoods)
                this.$cookies.set('searchHistoryList', this.searchHistoryList)
            }
        },
        getSearchHistory() {
            var tempList = this.$cookies.get('searchHistoryList') // 读取cookies
            if (tempList !== null) { // 判断cookies是否为空
                this.searchHistoryList = tempList.split(',') // 将cookies存储的字符串截取成数组
            }
        }
    },


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
      orderBy: ''
    })

    // onMounted(() => {
    //   init()
    // })

    const init = async () => {
      const { categoryId } = route.query
      if (!categoryId && !state.keyword) {
        // Toast.fail('请输入关键词')
        state.finished = true
        state.loading = false;
        return
      }
      const { data, data: { list } } = await search({ pageNumber: state.page, goodsCategoryId: categoryId, keyword: state.keyword, orderBy: state.orderBy })
      
      state.productList = state.productList.concat(list)
      state.totalPage = data.totalPage
      state.loading = false;
      if (state.page >= data.totalPage) state.finished = true
    }

    const goBack = () => {
      router.go(-1)
    }

    const productDetail = (item) => {
      router.push({ path: `/product/${item.giftId}` })
    }

    const getSearch = () => {
      router.push({path:'http://101.133.131.175:8080/mall/a/es/importAll'})

      onRefresh()
    

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

    const onRefresh = () => {
      state.refreshing = true
      state.finished = false
      state.loading = true
      state.page = 1
      onLoad()
    }

    const changeTab = (name) => {
      console.log('name', name)
      state.orderBy = name
      onRefresh()
    }

    return {
      ...toRefs(state),
      goBack,
      productDetail,
      getSearch,
      changeTab,
      onLoad,
      onRefresh
    }
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

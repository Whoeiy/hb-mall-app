<template>
  <div class="product-list-wrap">
    <div class="product-list-content">
      <header class="category-header wrap">
        <i class="nbicon nbfanhui" @click="goBack"></i>
        <div class="header-search">
          <i class="nbicon nbSearch"></i>
          <input
              placeholder="请输入搜索关键字"
              type="text"
              class="search-title"
              ref="getValue"
              v-model="keyword"
              maxlength="30"
              @keyup.enter="search()"
          />
        </div>
        <span class="search-btn" @click="search()" >搜索</span>
      </header>
      <div style="padding-left: 30px" v-show="true">
        <a herf="" style="cursor: default;padding-right: 10px">历史记录</a>
        <a style="padding-right: 10px; font-size: 14px; " v-for="(item,index) in brief" :key="index" @click="logodata(item,index)" >{{ item }}</a>
      </div>
<!--      <div class="content">-->
<!--        <van-pull-refresh v-model="refreshing" @refresh="onRefresh" class="product-list-refresh">-->
<!--          <van-list-->
<!--              v-model:loading="loading"-->
<!--              :finished="finished"-->
<!--              :finished-text="productList.length ? '没有更多了' : '搜索想要的商品'"-->
<!--              @load="onLoad"-->
<!--              @offset="10"-->

            <!-- <p v-for="item in list" :key="item">{{ item }}</p> -->
<!--            <template v-if="productList.length">-->
<!--              <div class="product-item" v-for="(item, index) in productList" :key="index" @click="productDetail(item)">-->
<!--                <img :src="$filters.prefix(item.imgUrl)" />-->
<!--                <div class="product-info">-->
<!--                  <p class="name">{{item.giftName}}</p>-->
<!--                  <p class="subtitle">{{item.giftIntro}}</p>-->
<!--                  <span class="price">￥ {{item.originalPrice}}</span>-->
<!--                </div>-->
<!--              </div>-->
<!--            </template>-->
<!--            <img class="empty"  src="../assets/search.png" alt="搜索">-->
<!--          </van-list>-->
<!--        </van-pull-refresh>-->
<!--    </div>-->
      <div >
        <div v-if="this.showFlag === true" class="search-history">
          <div class="tip-words">
            <div style="float: left;">
              <h4>搜索历史</h4>
            </div>
            <div style="float: right;" @click="clearHistoryItems">
              <img src="../assets/search.png" width="16px"/>
            </div>
          </div>
          <p style="margin-bottom: 10px">&nbsp;</p>
          <div  v-for="(item,index) in searchHistoryList" :key="index" @click="searchByHistoryKeyWord(item)" class="history-keywords">
            &nbsp;&nbsp;{{item}}&nbsp;&nbsp;
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>

import {Toast} from "vant";
import {useRoute, useRouter} from "vue-router";
import {reactive, toRefs} from "vue";
import {search} from "@/service/good";


export default {
  data(){
    return{
      brief:[],
      keyword:'',
      searchHistoryList: [],
      // 标记显示搜索历史
      showFlag: false,
      loadShow: false
    }

  },
  methods: {

      showHistory() {
        if (this.searchHistoryList.length > 0) {
          this.showFlag = true
        }
      },
      // 清空历史记录
      clearHistoryItems() {
        localStorage.removeItem('historyItems')
        this.searchHistoryList = []
        this.showFlag = false
      },
      // 过滤一个结果的空记录添加，过滤空搜索
      appendKeywords(value) {
        /**
         * 1.已经有的关键词不再添加
         * 2.添加到数组的首位，若超出10个则删除最后一个
         * 3.添加到缓存
         */
        var appendFlag = true
        if (this.searchHistoryList !== null && this.searchHistoryList !== undefined && this.searchHistoryList.length > 0) {
          this.searchHistoryList.forEach(function(currentValue) {
            if (currentValue === value) {
              appendFlag = false
              return
            }
          })
          // 判断-添加
          if (appendFlag === true) {
            // 长度判断
            if (this.searchHistoryList.length >= 10) {
              this.searchHistoryList.unshift(value)
              this.searchHistoryList.pop()
            } else {
              this.searchHistoryList.unshift(value)
            }
            localStorage.setItem('historyItems', JSON.stringify(this.searchHistoryList))
          }
        } else {
          this.searchHistoryList = []
          this.searchHistoryList.push(value)
          localStorage.setItem('historyItems', JSON.stringify(this.searchHistoryList))
        }
      },
      searchByHistoryKeyWord(item) {
        this.loadTip = ''
        this.queryData.inputInfo = item
        // 查询
        // fetchGetDataByKeyWord(item).then(response => {
        //   // 查询赋值
        //   this.dataList = response.data.body.data
          // if (this.dataList.length === 0) {
          //   this.loadTip = '没有符合条件数据'
          //   this.showHistory()
          // } else {
          //   this.loadTip = ''
          //   this.showFlag = false
          // }
        // })
      },







    search(){
  if(this.keyword!==''){
    let val = this.keyword.trim()
    if(!val){
      Toast.fail('请输入')
      return
    }
if(this.brief.indexOf(val)===-1){
this.brief.unshift(val)
this.brief=this.brief.slice(0,5)
localStorage.setItem('history',JSON.stringify(this.brief))
}
  }
}
  },
  mounted(){
    if(JSON.parse(localStorage.getItem("history"))){
      this.brief=JSON.parse(localStorage.getItem("history"))
    }
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      keyword: route.query.keyword || '',
      list: [],
      loading: false,
      finished: false,
      productList: [],
      totalPage: 0,
      page: 1,

    })



    const goBack = () => {
      router.go(-1)
    }
    const goToSearch = async () => {
      await search({ keyword: state.keyword })
      // store.dispatch('updateCart')
      router.push({ path: '/product-list' })
    }


    return {
      ...toRefs(state),
      goBack,
      goToSearch
    }
  }
}
</script>


<style lang="less" scoped>
//@import '../common/style/mixin';
//.product-list-content {
//  position: fixed;
//  left: 0;
//  top: 0;
//  width: 100%;
//  z-index: 1000;
//  background: #fff;
//  .category-header {
//    .fj();
//    width: 100%;
//    height: 50px;
//    line-height: 50px;
//    padding: 0 15px;
//    .boxSizing();
//    font-size: 15px;
//    color: #656771;
//    z-index: 10000;
//    &.active {
//      background: @primary;
//    }
//    .icon-left {
//      font-size: 25px;
//      font-weight: bold;
//    }
//    .header-search {
//      display: flex;
//      width: 76%;
//      height: 20px;
//      line-height: 20px;
//      margin: 10px 0;
//      padding: 5px 0;
//      color: #232326;
//      background: #F7F7F7;
//      .borderRadius(20px);
//      .nbSearch {
//        padding: 0 5px 0 20px;
//        font-size: 17px;
//      }
//      .search-title {
//        font-size: 12px;
//        color: #666;
//        background: #F7F7F7;
//      }
//    }
//    .icon-More {
//      font-size: 20px;
//    }
//    .search-btn {
//      height: 28px;
//      margin: 8px 0;
//      line-height: 28px;
//      padding: 0 5px;
//      color: #fff;
//      background: @primary;
//      .borderRadius(5px);
//      margin-top: 10px;
//    }
//  }
//}
//.content {
//  height: calc(~"(100vh - 70px)");
//  overflow: hidden;
//  overflow-y: scroll;
//  margin-top: 78px;
//}
//.product-list-refresh {
//  .product-item {
//    .fj();
//    width: 100%;
//    height: 120px;
//    padding: 10px 0;
//    border-bottom: 1px solid #dcdcdc;
//    img {
//      width: 140px;
//      height: 120px;
//      padding: 0 10px;
//      .boxSizing();
//    }
//    .product-info {
//      width: 56%;
//      height: 120px;
//      padding: 5px;
//      text-align: left;
//      .boxSizing();
//      p {
//        margin: 0
//      }
//      .name {
//        width: 100%;
//        max-height: 40px;
//        line-height: 20px;
//        font-size: 15px;
//        color: #333;
//        overflow: hidden;
//        text-overflow:ellipsis;
//        white-space: nowrap;
//      }
//      .subtitle {
//        width: 100%;
//        max-height: 20px;
//        padding: 10px 0;
//        line-height: 25px;
//        font-size: 13px;
//        color: #999;
//        overflow: hidden;
//      }
//      .price {
//        color: @primary;
//        font-size: 16px;
//      }
//    }
//  }
//
//  .empty {
//    display: block;
//    width: 290px;
//    margin: 50px auto 20px;
//  }
//
//}
</style>

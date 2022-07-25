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
              @keyup.enter="get_search()"
          />
        </div>
        <span class="search-btn" @click="get_search()" >搜索</span>

      </header>

      <div style="border-color: #FF6B01;width: 100%">

     <div style="margin-left: 20px;" >历史搜索 <van-button icon="delete" alt="删除历史记录" style="width:5%;float:right;margin-right: 20px" @click="empty"></van-button></div>

        <ul style="margin-left: 40px">
          <li v-for="(item,index) in historyList" :key="index" @click="goSearchDetail(item)">{{item}}</li>
        </ul>
      </div>

</div>

  </div>
</template>

<script>


export default {
  data() {
    return {
      keyword : '', //搜索的内容
      historyList: [] //历史搜索记录，存本地
    }
  },
  mounted() {
    //如果本地存储的数据historyList有值，直接赋值给data中的historyList
    if (JSON.parse(localStorage.getItem("historyList"))) {
      this.historyList = JSON.parse(localStorage.getItem("historyList"));
    }
  },
  methods: {
    // 搜索
    get_search(){
      if(this.keyword == ''){
        this.$toast('请输入搜索内容');
        return false;
      }else{
        // 没有搜索记录，把搜索值push进数组首位，存入本地
        if (!this.historyList.includes(this.keyword)) {
          this.historyList.unshift(this.keyword);
          localStorage.setItem("historyList", JSON.stringify(this.historyList));
        }else{
          //有搜索记录，删除之前的旧记录，将新搜索值重新push到数组首位
          let i =this.historyList.indexOf(this.keyword);
          this.historyList.splice(i,1)
          this.historyList.unshift(this.keyword);
          localStorage.setItem("historyList", JSON.stringify(this.historyList));
        }
        //跳转到搜索结果页

        this.$router.get({

          path: "/product-list",
          query: {
            keyword: this.keyword,
          },
        });
      }
    },

    //点击历史搜索，跳转搜索结果页
    goSearchDetail(title){
      this.$router.get({
        path: "/product-list",
        query: {
          keyword: title,
        },
      });
    },

    //清空历史搜索记录
    empty(){
      this.$toast.success('清空历史搜索成功');
      localStorage.removeItem('historyList');
      this.historyList = [];
    }
  },


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
    width: 290px;
    margin: 50px auto 20px;
  }

}
</style>

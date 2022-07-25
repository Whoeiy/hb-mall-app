
<template>
  <div class="cart-box">
    <s-header :name="'购物车'" :noback="true"></s-header>
    <div class="cart-body">
      <van-checkbox-group @change="groupChange" v-model="result" ref="checkboxGroup">
        <van-swipe-cell :right-width="50" v-for="(item, index) in list" :key="index">
          <div class="good-item">
            <van-checkbox :name="item.giftId" />
            <div class="good-img"><img :src="$filters.prefix(item.giftImg)" alt=""></div>
            <div class="good-desc">
              <div class="good-title">
                <span>{{ item.giftName }}</span>
                <span>x{{ item.count }}</span>
<!--                <span>{{ item.price }}</span>-->
              </div>

              <div class="good-btn">
                <div class="price">¥{{ item.price }}</div>
                <van-stepper
                    integer
                    :min="0"
                    :max="10"
                    :model-value="item.count"
                    :name="item.giftId"
                    async-change
                    @change="onChange"
                    @minus="onMinus(item.count)"
                />
                <div >

                </div>

                <van-button
                    square
                    icon="delete"
                    type="danger"
                    class="delete-button"
                    @click="deleteGood(item.giftId)"
                />
              </div>
            </div>
          </div>

        </van-swipe-cell>
      </van-checkbox-group>
    </div>
    <van-submit-bar
      v-if="list.length > 0"
      class="submit-all van-hairline--top"
      :price="total * 100"
      button-text="结算"
      @submit="onSubmit"
    >
      <van-checkbox @click="allCheck" v-model:checked="checkAll" >全选</van-checkbox>
    </van-submit-bar>
    <div class="empty" v-if="!list.length">
      <img class="empty-cart" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBgV-oOzdXRyFhK29DLEp1tFExf5fqbQPtyA&usqp=CAU" alt="空购物车">
      <div class="title">购物车空空如也</div>
      <van-button round color=rgb(255,50,10) type="primary" @click="goTo" block>前往选购</van-button>
    </div>
    <nav-bar></nav-bar>
  </div>
</template>

<script>
import { reactive, onMounted, computed, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Toast } from 'vant'
import { getLocal } from '@/common/js/utils'
import navBar from '@/components/NavBar'
import sHeader from '@/components/SimpleHeader'
import {getCart, deleteCartItem, modifyCart} from '@/service/cart'

export default {
  components: {
    navBar,
    sHeader
  },


  setup() {
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      checked: false,
      list: [],
      all: false,
      result: [],
      checkAll: false,
      isLogin: false
    })

    onMounted(() => {
      const token = getLocal('token')
      if (token) {
        state.isLogin = true
      init()}
      else{
        router.push({path: `/Login`})
      }
    })

    const init = async () => {
      Toast.loading({ message: '加载中...', forbidClick: true });
      const { data } = await getCart()
      console.log(data)
      if (data != null) {
        state.list = data.cartItems
        // state.result = data.map(item => item.giftId)
        Toast.clear()
      }
    }

    const total = computed(() => {
      let sum = 0
      let _list = state.list.filter(item => state.result.includes(item.giftId))
      _list.forEach(item => {
        sum += item.count * item.price
      })
      return sum
    })

    const goBack = () => {
      router.go(-1)
    }

    const goTo = () => {
      router.push({ path: '/home' })
    }

    const onMinus= async (value, detail) => {

      if (state.list.filter(item => item.giftId == detail.name)[0].count  == value )return
      Toast.loading({ message: '修改中...', forbidClick: true });

      await deleteCartItem(detail.name)

      state.list.forEach(item => {
        if (item.giftId == detail.name) {
          item.count = value
          //  item.price= state.list.filter(item => item.giftId == detail.name)[0].price
        }
      })
      Toast.clear();
    }

    const onChange = async (value, detail) => {
      if (value > 10) {
        Toast.fail('超出单个商品的最大购买数量')
        return
      }
      if (value < 1) {
        Toast.fail('商品不得小于0')
        return
      }
      if (state.list.filter(item => item.giftId == detail.name)[0].count == value) return
      Toast.loading({ message: '修改中...', forbidClick: true });
      const params = {
        giftId: detail.name,
        count: value,
        price: state.list.price

      }
      await modifyCart(params)
      state.list.forEach(item => {
        if (item.giftId == detail.name) {
          item.count = value
        }
      })
      Toast.clear();
    }


    const onSubmit = async () => {
      if (state.result.length == 0) {
        Toast.fail('请选择商品进行结算')
        return
      }
      const params = JSON.stringify(state.result)
      router.push({ path: '/create-order', query: { cartItems: params } })
    }

    const deleteGood = async (id) => {
      await deleteCartItem(id)
      store.dispatch('updateCart')
      init()
    }

    const groupChange = (result) => {
      console.log(1)
      if (result.length == state.list.length) {
        console.log(2)
        state.checkAll = true
      } else {
        console.log(3)
        state.checkAll = false
      }
      state.result = result
    }
    
    const allCheck = () => {
      if (!state.checkAll) {
        state.result = state.list.map(item => item.giftId)
      } else {
        state.result = []
      }
    }

    

    return {
      ...toRefs(state),
      total,
      goBack,
      goTo,
      onChange,
      onSubmit,
      deleteGood,
      groupChange,
      allCheck,
      onMinus,

    }
  }
}
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
      color: #252525;
      background: #fff;
      border-bottom: 1px solid #dcdcdc;
      .cart-name {
        font-size: 14px;
      }
    }
    .cart-body {
      margin: 16px 0 100px 0;
      padding-left: 10px;
      .good-item {
        display: flex;
        .good-img {
          img {
            .wh(100px, 100px)
          }
        }
        .good-desc {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          padding: 20px;
          .good-title {
            display: flex;
            justify-content: space-between;
          }
          .good-btn {
            display: flex;
            justify-content: space-between;
            .price {
              font-size: 16px;
              color: red;
              line-height: 28px;
            }
            .van-icon-delete {
              font-size: 20px;
              margin-top: 4px;
            }
          }
        }
      }
      .delete-button {
        width: 25px;
        height: 100%;
        ;
      }
    }
    .empty {
      width: 50%;
      margin: 0 auto;
      text-align: center;
      margin-top: 200px;
      .empty-cart {
        width: 150px;
        margin-bottom: 20px;
      }
      .van-icon-smile-o {
        font-size: 50px;
      }
      .title {
        font-size: 16px;
        margin-bottom: 20px;
      }
    }
    .submit-all {
      margin-bottom: 50px;
      .van-checkbox {
        margin-left: 10px
      }
      .van-submit-bar__text {
        margin-right: 10px
      }
      .van-submit-bar__button {
        background: @primary;
      }
    }
    .van-checkbox__icon--checked .van-icon {
      background-color: @primary;
      border-color: @primary;
    }
  }
</style>

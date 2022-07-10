<!--
 * 严肃声明：
 * 开源版本请务必保留此注释头信息，若删除我方将保留所有法律责任追究！
 * 本系统已申请软件著作权，受国家版权局知识产权以及国家计算机软件著作权保护！
 * 可正常分享和学习源码，不得用于违法犯罪活动，违者必究！
 * Copyright (c) 2020 陈尼克 all rights reserved.
 * 版权所有，侵权必究！
 *
-->

<template>
  <div class="create-order">
    <s-header :name="'生成订单'" @callback="deleteLocal"></s-header>
    <div class="address-wrap">
      <div class="name" @click="goTo">
        <span>{{ address.customerName }} </span>
        <span>{{ address.customerPhone }}</span>
      </div>
      <div class="address">
        {{ address.provinceName }} {{ address.cityName }}
        {{ address.regionName }} {{ address.detailAddress }}
      </div>
      <van-icon class="arrow" name="arrow" />
    </div>
    <div class="good">
      <div class="good-item" v-for="(item, index) in cartList" :key="index">
        <div class="good-img">
          <img :src="$filters.prefix(item.giftImg)" alt="" />
        </div>
        <div class="good-desc">
          <div class="good-title">
            <span>{{ item.giftName }}</span>
            <span>x{{ item.count }}</span>
            <div v-if="item.service != null">
              <span>{{ item.service.serviceChosenTypeName }}</span>
            </div>
          </div>
          <div class="good-btn">
            <div class="price">¥{{ item.sellingPrice }}</div>
            <div
              v-if="item.service != null && item.service.serviceChosenType == 2"
            >
              <span
                >{{ item.service.normalServiceTypeName }}-{{
                  item.service.normalServiceName
                }}</span
              >
            </div>
            <button
              @click="showPopup(item.giftId, index)"
              class="custom-button"
            >
              定制礼物
            </button>

            <van-popup v-model:show="show">
              <div :style="{ width: '90%', padding: '50px 20px' }">
                <van-radio-group v-model="checked" @click="getSelect()">
                  <van-radio
                    :style="{ margin: '10px' }"
                    name="1"
                    checked-color="#ee0a24"
                    clickable
                    >无需定制</van-radio
                  >
                  <van-radio
                    :style="{ margin: '10px' }"
                    name="2"
                    checked-color="#ee0a24"
                    clickable
                    >普通定制服务</van-radio
                  >
                  <van-radio
                    :style="{ margin: '10px' }"
                    name="3"
                    checked-color="#ee0a24"
                    clickable
                    >私人定制服务</van-radio
                  >
                </van-radio-group>
              </div>
            </van-popup>
          </div>
        </div>
      </div>
    </div>
    <div class="pay-wrap">
      <div class="price">
        <span>商品金额</span>
        <span>¥{{ total }}</span>
      </div>
      <van-button
        @click="handleCreateOrder"
        class="pay-btn"
        color="rgb(235, 71, 33)"
        type="primary"
        block
        >生成订单</van-button
      >
    </div>
    <van-popup
      closeable
      :close-on-click-overlay="false"
      v-model:show="showPay"
      position="bottom"
      :style="{ height: '30%' }"
      @close="close"
    >
      <div :style="{ width: '90%', margin: '0 auto', padding: '50px 0' }">
        <van-button
          :style="{ marginBottom: '10px' }"
          color="#1989fa"
          block
          @click="handlePayOrder(1)"
          >支付宝支付</van-button
        >
        <van-button color="#4fc08d" block @click="handlePayOrder(2)"
          >微信支付</van-button
        >
      </div>
    </van-popup>
  </div>
</template>

<script>
import { reactive, onMounted, toRefs, computed, ref, onActivated } from "vue";
import sHeader from "@/components/SimpleHeader";
import { getByCartItemIds, updateService } from "@/service/cart";
import { getDefaultAddress, getAddressDetail } from "@/service/address";
import { createOrder, payOrder } from "@/service/order";
import { setLocal, getLocal } from "@/common/js/utils";
import { Toast } from "vant";
import { useRoute, useRouter } from "vue-router";
export default {
  components: {
    sHeader,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      cartList: [],
      address: {},
      showPay: false,
      orderNo: "",
      cartItemIds: [],
      currentItemId: "",
      serviceChosenType: "",
    });
    const show = ref(false);
    const showPopup = (id, index) => {
      show.value = true;
      state.currentItemId = id;
      let array = state.cartList.map((item) => item.service.serviceChosenType);
      checked.value = array[index].toString();
      //checked.value = state.cartList.map((item) => item.service.serviceChosenType).toString();
    };
    const checked = ref("1");
    const getSelect = () => {
      console.log(state.currentItemId);
      if (checked.value == 1) {
        state.serviceChosenType = checked.value;
        console.log(state.serviceChosenType);
        updateService({
          giftId: state.currentItemId,
          serviceChosenType: parseInt(checked.value),
        });
        location.reload();
      }
      if (checked.value == 2) {
        state.serviceChosenType = checked.value;
        Toast.loading({
          message: "正为您转到定制页面...",
          forbidClick: true,
        });
        checked.value = state.serviceChosenType.toString();
        setTimeout(() => {
          router.push({
            path: "/custom-add",
            query: {
              currentItemId: JSON.stringify(state.currentItemId),
              serviceChosenType: JSON.stringify(parseInt(checked.value)),
            },
          });
        }, 200);
      }
      if (checked.value == 3) {
        state.serviceChosenType = checked.value;
        Toast.loading({
          message: "正为您转到定制页面...",
          forbidClick: true,
        });
        checked.value = state.serviceChosenType.toString();
        setTimeout(() => {
          router.push({
            path: "/private-custom-add",
            query: {
              currentItemId: JSON.stringify(state.currentItemId),
              serviceChosenType: JSON.stringify(parseInt(checked.value)),
            },
          });
        }, 200);
      }
      console.log(state.serviceChosenType);
      checked.value = state.serviceChosenType.toString();
    };

    onMounted(() => {
      init();
    });
    onActivated(() => {
      init();
      location.reload();
    });

    const init = async () => {
      Toast.loading({ message: "加载中...", forbidClick: true });
      const { addressId, cartItems } = route.query;
      console.log(cartItems);
      const _cartItems = cartItems
        ? JSON.parse(cartItems)
        : JSON.parse(getLocal("cartItems"));
      setLocal("cartItems", JSON.stringify(_cartItems));
      console.log("cartItems", _cartItems.join(","));
      const { data: list } = await getByCartItemIds({
        giftIdList: _cartItems.join(","),
      });
      const { data: address } = addressId
        ? await getAddressDetail(addressId)
        : await getDefaultAddress();
      if (!address) {
        router.push({ path: "/address" });
        return;
      }
      state.cartList = list.cartItems;
      console.log(state.cartList);
      state.address = address;
      Toast.clear();
    };

    const goTo = () => {
      router.push({
        path: "/address",
        query: {
          cartItemIds: JSON.stringify(state.cartItemIds),
          from: "create-order",
        },
      });
    };

    const deleteLocal = () => {
      setLocal("cartItemIds", "");
    };

    const handleCreateOrder = async () => {
      const params = {
        addressId: state.address.addressId,
        giftIdList: state.cartList.map((item) => item.giftId).join(","),
      };
      const { data } = await createOrder(params);
      setLocal("cartItemIds", "");
      state.orderNo = data;
      state.showPay = true;
    };

    const close = () => {
      router.push({ path: "/order" });
    };

    const handlePayOrder = async (type) => {
      await payOrder({ orderNo: parseInt(state.orderNo), payType: type });
      Toast.success("支付成功");
      setTimeout(() => {
        router.push({ path: "/order" });
      }, 2000);
    };

    const total = computed(() => {
      let sum = 0;
      state.cartList.forEach((item) => {
        sum += item.count * item.sellingPrice;
      });
      return sum;
    });

    const handleAddCustom = () => {
      router.push({ path: "/custom-add" });
    };

    return {
      ...toRefs(state),
      goTo,
      deleteLocal,
      handleCreateOrder,
      close,
      handlePayOrder,
      total,
      handleAddCustom,
      show,
      showPopup,
      checked,
      getSelect,
    };
  },
};
</script>

<style lang="less" scoped>
@import "../common/style/mixin";
.create-order {
  background: #f9f9f9;
  .address-wrap {
    margin-bottom: 20px;
    background: #fff;
    position: relative;
    font-size: 14px;
    padding: 15px;
    color: #222333;
    .name,
    .address {
      margin: 10px 0;
    }
    .arrow {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
    }
    &::before {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 2px;
      background: -webkit-repeating-linear-gradient(
        135deg,
        #ff6c6c 0,
        #ff6c6c 20%,
        transparent 0,
        transparent 25%,
        #1989fa 0,
        #1989fa 45%,
        transparent 0,
        transparent 50%
      );
      background: repeating-linear-gradient(
        -45deg,
        #ff6c6c 0,
        #ff6c6c 20%,
        transparent 0,
        transparent 25%,
        #1989fa 0,
        #1989fa 45%,
        transparent 0,
        transparent 50%
      );
      background-size: 80px;
      content: "";
    }
  }
  .good {
    margin-bottom: 120px;
  }
  .good-item {
    padding: 10px;
    background: #fff;
    display: flex;
    .good-img {
      img {
        .wh(100px, 100px);
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
        .custom-button {
          background-color: rgb(235, 71, 33);
          color: white;
        }
        .van-icon-delete {
          font-size: 20px;
          margin-top: 4px;
        }
      }
    }
  }
  .pay-wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    padding: 10px 0;
    padding-bottom: 50px;
    border-top: 1px solid #e9e9e9;
    > div {
      display: flex;
      justify-content: space-between;
      padding: 0 5%;
      margin: 10px 0;
      font-size: 14px;
      span:nth-child(2) {
        color: red;
        font-size: 18px;
      }
    }
    .pay-btn {
      position: fixed;
      bottom: 7px;
      right: 0;
      left: 0;
      width: 90%;
      margin: 0 auto;
    }
  }
}
</style>

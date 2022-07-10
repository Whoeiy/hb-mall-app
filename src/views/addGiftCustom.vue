<template>
  <div class="address-edit-box">
    <s-header :name="'普通定制服务'"></s-header>
    <div v-for="(item, index) in serviceList" :key="index">
      <!-- <span>{{ item.serviceName }}</span> -->
      <van-divider>{{ item.serviceName }}</van-divider>
      <div
        v-for="(item, index) in serviceList[index].serviceItemVo"
        :key="index"
      >
        <van-radio-group v-model="checked" @click="getSelect()">
          <van-radio :name="item.serviceId" checked-color="#ee0a24">{{
            item.serviceName
          }}</van-radio>
        </van-radio-group>
        <img
          :src="$filters.prefix(item.sampleImg)"
          alt=""
          style="width: 60%; padding-left: 80px"
        />
      </div>
    </div>

    <van-cell-group inset style="padding-bottom: 50px">
      <van-field
        v-model="message"
        rows="2"
        autosize
        label="备注"
        type="textarea"
        maxlength="50"
        placeholder="请备注卡片颜色或包装样式"
        show-word-limit
      />
    </van-cell-group>
    <van-button
      size="large"
      style="margin-bottom: 50px; background-color: #ee0a24; color: white"
      @click="submit()"
      >提交</van-button
    >
  </div>
</template>

<script>
import { toRefs, ref, reactive, onMounted } from "vue";
//import { Toast } from "vant";
import sHeader from "@/components/SimpleHeader";

import { useRoute, useRouter } from "vue-router";
import { getService, updateService, getByCartItemIds } from "@/service/cart";
export default {
  components: {
    sHeader,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const checked = ref("1");
    const message = ref("");
    const { currentItemId } = route.query;
    //console.log(currentItemId);
    const { serviceChosenType } = route.query;
    console.log(serviceChosenType);
    const state = reactive({
      serviceList: [],
      selectServiceId: "",
      service: {},
    });

    onMounted(() => {
      init();
    });

    const init = async () => {
      const { data } = await getService(currentItemId);
      console.log(data);
      state.serviceList = data;
      console.log(state.serviceList);
      const { data: list } = await getByCartItemIds({
        giftIdList: currentItemId,
      });
      //console.log(list.cartItems[0].service);
      state.service = list.cartItems[0].service;
      console.log(state.service);
      if (state.service.serviceChosenType == 2) {
        checked.value = state.service.normalServiceId;
        message.value = state.service.serviceNote;
        state.selectServiceId = state.service.normalServiceId;
      }
    };

    const getSelect = () => {
      //console.log(checked.value);
      state.selectServiceId = checked.value;
      console.log("state.selectServiceId " + state.selectServiceId);
    };

    const submit = async() => {
      //console.log("state.selectServiceId " + state.selectServiceId);
      //console.log(parseInt(serviceChosenType))
      await updateService({
        giftId: currentItemId,
        serviceChosenType: parseInt(serviceChosenType),
        normalServiceId: state.selectServiceId,
        serviceNote: message.value,
      })
      setTimeout(() => {
        router.back();
      }, 200);
      
    };

    return {
      ...toRefs(state),
      checked,
      message,
      getSelect,
      submit,
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
}
</style>

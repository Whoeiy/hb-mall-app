<template>
  <div class="address-edit-box">
    <s-header :name="'私人定制服务'"></s-header>

    <van-cell-group inset style="padding-bottom: 50px">
      <van-field
        v-model="message"
        rows="2"
        autosize
        label="需求和设想"
        type="textarea"
        maxlength="50"
        placeholder="请输入留言"
        show-word-limit
      />
      <van-field v-model="tel" type="tel" label="手机号" required />
    </van-cell-group>
    <van-button
      size="large"
      style="margin-bottom: 50px; background-color: #ee0a24; color: white"
      @click="submit"
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
    const tel = ref("");
    const message = ref("");
    const { currentItemId } = route.query;
    const { serviceChosenType } = route.query;
    console.log(currentItemId);
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
      console.log(list);
      state.service = list.cartItems[0].service;
      console.log(state.service);
      //checked.value = state.service.normalServiceId;
      if (state.service.serviceChosenType == 3) {
        message.value = state.service.serviceNote;
        tel.value = state.service.phone;
      }
    };
    const submit = () => {
      updateService({
        giftId: currentItemId,
        serviceChosenType: parseInt(serviceChosenType),
        serviceNote: message.value,
        phone: tel.value,
      });
      router.back();
    };

    return {
      ...toRefs(state),
      checked,
      tel,
      message,
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

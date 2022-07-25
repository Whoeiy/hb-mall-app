
<template>
  <div class="address-box">
    <s-header
      :name="'优惠券管理'"
      :back="from == 'create-order' ? '' : '/user'"
    ></s-header>
    <div class="address-item">
      <van-address-list
        class="items"
        v-if="from != 'mine'"
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
      />

      <van-address-list
        v-else
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
      />
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import sHeader from "@/components/SimpleHeader";
import { getCoupon } from "@/service/user";
import { useRoute, useRouter } from "vue-router";
export default {
  components: {
    sHeader,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      chosenAddressId: "1",
      list: [],
      from: route.query.from,
    });

    onMounted(async () => {
      const { data } = await getCoupon();
      if (!data) {
        state.list = [];
        return;
      }
      state.list = data.map((data) => {
        return {
          id: data.couponId,
          name: data.couponName,
          tel: data.couponTypeName,
          address: `有效时间：${formatDate(data.startTime)} -${formatDate(
            data.endTime
          )}`,
          //isDefault: !!item.defaultFlag
        };
      });
    });

    const onAdd = () => {
      router.push({
        path: "/coupon-edit",
        query: { type: "add", from: state.from },
      });
    };

    const onEdit = (item) => {
      router.push({
        path: "coupon-edit",
        query: { type: "edit", addressId: item.id, from: state.from },
      });
    };

    const select = (item) => {
      router.push({
        path: "create-order",
        query: { addressId: item.id, from: state.from },
      });
    };
    const formatDate = (value) => {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + MM + "-" + d + " ";
    };

    return {
      ...toRefs(state),
      onAdd,
      onEdit,
      select,
      formatDate,
    };
  },
};
</script>

<style lang="less">
@import "../common/style/mixin";
.address-box {
  background-color: rgb(248, 248, 248);
  .van-radio__icon {
    display: none;
  }
  .address-item {
    .van-button {
      background: rgb(255, 255, 255);
      border-color: rgb(255, 255, 255);
      text-decoration-color: rgb(255, 255, 255);
    }
  }
}
</style>

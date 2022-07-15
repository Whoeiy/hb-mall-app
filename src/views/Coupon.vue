
<template>
  <div class="address-box">
    <s-header :name="'优惠券管理'" :back="from == 'create-order' ? '' : '/user'"></s-header>
    <div class="address-item">
      <van-address-list
        v-if="from != 'mine'"
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        
      />

      <!--
        @add="onAdd"
        @edit="onEdit"
        @select="select"
      -->
      
        <van-address-list
        v-else
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        
      />

      <!--
        @add="onAdd"
        @edit="onEdit"
        
      -->
      
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import sHeader from '@/components/SimpleHeader'
//import { getAddressList } from '@/service/address'
import { getCoupon } from '@/service/user'
import { useRoute, useRouter } from 'vue-router'
export default {
  components: {
    sHeader
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      chosenAddressId: '1',
      list: [],
      from: route.query.from
    })

    onMounted(async () => {
      const { data } = await getCoupon()
      if (!data) {
        state.list = []
        return
      }
      state.list = data.map(data => {
        return {
          id: data.couponId,
          name: data.couponName,
          tel: data.couponTypeName,
          address: `开始时间：${data.startTime} 结束时间：${data.endTime} 添加时间：${data.addTime} `,//${item.detailAddress}
          //isDefault: !!item.defaultFlag
        }
      })
    })

    const onAdd = () => {
      router.push({ path: '/coupon-edit', query: { type: 'add', from: state.from }})
    }

    const onEdit = (item) => {
      router.push({ path: 'coupon-edit', query: { type: 'edit', addressId: item.id, from: state.from }})
    }

    const select = (item) => {
      router.push({ path: 'create-order', query: { addressId: item.id, from: state.from }})
    }

    return {
      ...toRefs(state),
      onAdd,
      onEdit,
      select
    }
  }
}
</script>

<style lang="less">
  @import '../common/style/mixin';
  .address-box {
    .van-radio__icon {
      display: none;

    }
    .address-item {
      .van-button {
        background:rgb(255, 255, 255);
        border-color:rgb(255, 255, 255);
        text-decoration-color: rgb(255, 255, 255);
      }
    }
  }
</style>


<template>
  <div class="seting-box">
    <s-header :name="'账号管理'"></s-header>
    <div class="input-item">
      <van-field
        v-model="customerName"
        label="用户名"
        required
        placeholder="请输入用户名"
      />
      <van-field v-model="phone" label="手机号" disabled />
      <van-field v-model="email" label="邮箱" required  placeholder="请输入邮箱"/>

      <van-divider>修改密码</van-divider>
      <van-field v-model="password" type="password" label="请输入原密码" />
      <van-field v-model="newpassword" type="password" label="请输入新密码" />
      <van-field
        v-model="newpassword1"
        type="password"
        label="请再次输入新密码"
      />
    </div>
    <van-button
      round
      class="save-btn"
      color="#bd2b26"
      type="primary"
      @click="save"
      block
      >保存</van-button
    >
    <van-button
      round
      class="save-btn"
      color="#bd2b26"
      type="primary"
      @click="handleLogout"
      block
      >退出登录</van-button
    >
  </div>
</template>

<script>
import { reactive, onMounted, toRefs } from "vue";
import md5 from "js-md5";
import sHeader from "@/components/SimpleHeader";
import { getUserInfo, EditUserInfo, logout } from "@/service/user";
import { setLocal } from "@/common/js/utils";
import { Toast } from "vant";

export default {
  components: {
    sHeader,
  },
  setup() {
    const state = reactive({
      customerName: "",
      email: "",
      phone: "",
      password: "",
      newpassword: "",
      newpassword1: "",
    });

    onMounted(async () => {
      const { data } = await getUserInfo();
      state.customerName = data.customerName;
      state.phone = data.phone;
      state.email = data.email;
    });

    const save = async () => {
      const params = {
        email: state.email,
        customerName: state.customerName,
        orgPasswordMd5: state.password,
        newPassword: state.newpassword,
      };
      const params1 = {
        email: state.email,
        customerName: state.customerName,
      };
      if (!state.customerName) {
        Toast.fail("用户名不能为空");
        return;
      }
      if (!state.email) {
        Toast.fail("邮箱不能为空");
        return;
      }
      if (state.newpassword != state.newpassword1) {
        Toast.fail("两次密码填写不一致");
        return;
      }
      if (state.password) {
        params.orgPasswordMd5 = md5(state.password);
      }
      if (state.newpassword) {
        params.newPassword = md5(state.newpassword);
      }
      if (state.password && state.newpassword) {
        await EditUserInfo(params);
      } else {
        await EditUserInfo(params1);
      }
      //await EditUserInfo(params);
      Toast.success("保存成功");
    };

    const handleLogout = async () => {
      const { code } = await logout();
      if (code == 200) {
        setLocal("token", "");
        window.location.href = "/home";
      }
    };

    return {
      ...toRefs(state),
      save,
      handleLogout,
    };
  },
};
</script>

<style lang="less" scoped>
.seting-box {
  .save-btn {
    width: 80%;
    margin: 20px auto;
  }
}
</style>

<template>
  <div class="cart-box">
    <s-header :name="'发布帖子'" :noback="faulse"></s-header>

    <div>
      <van-form
        @submit="onSubmit"
        v-model="post"
        style="padding-left: 20px; padding-top: 30px"
      >
        <van-uploader :after-read="afterRead" v-model="fileList" />
        <van-field
          v-model="title"
          name="title"
          label="主题"
          placeholder="帖子的主题"
          :rules="[{ required: true, message: '请填写帖子的主题' }]"
        />
        <van-field
          style="height: 200px; margin-bottom: 0px"
          v-model="postContent"
          name="postContent"
          label="内容"
          placeholder="帖子的内容"
          :rules="[{ required: true, message: '请填写帖子的主要内容' }]"
        />

        <!-- <van-uploader :after-read="uploadImg"> <div style="width:300px; height: 400px;" @click="uploadImg">
          <span style="font-weight: bold;font-size: 100px;">+</span>
          <p style="font-weight: bold;font-size: 20px">添加活动相关图片</p>
        </div></van-uploader> -->

        <!--        <div class="input-up">-->
        <!--          <input-->

        <!--              type="file"-->

        <!--              accept="image/*"-->
        <!--              style="display:none;height: 200px"-->
        <!--              @change="changeImg()"-->
        <!--              name="upload_file"-->
        <!--              ref="input"-->
        <!--          />-->
        <!--          <div class="uploads" v-if="otherimg!=''" @click="upload">-->
        <!--            <img  v-if="otherimg"-->
        <!--                  :src="otherimg"  alt  style="width:300px; height: 400px"/>-->
        <!--          </div>-->
        <!--          <div class="upload" v-else @click="upload">-->
        <!--            <span style="font-weight: bold;font-size: 100px">+</span>-->
        <!--            <p style="font-weight: bold;font-size: 20px">添加活动相关图片</p>-->
        <!--          </div>-->
        <!--        </div>-->

        <!--        <van-uploader-->
        <!--            :after-read="afterRead"-->
        <!--            v-model="fileList"-->
        <!--            multiple-->
        <!--            :max-count="1"-->
        <!--            :max-size="1080 * 2400"-->
        <!--            @oversize="onOversize"-->
        <!--        >-->

        <!--            <van-button style="width: 100%; height: 400px">点击此处上传帖子的主图</van-button>-->
        <!--          </van-uploader>-->
      </van-form>
      <van-button
        round
        block
        color="#ee1110"
        native-type="submit"
        style="
          width: 94%;
          position: fixed;
          bottom: 10px;
          margin: 10px 10px 10px 10px;
        "
        @click="onSubmit"
        >发布</van-button
      >
    </div>
  </div>
</template>
<script>
import sHeader from "@/components/SimpleHeader";
import { onMounted, reactive, ref, toRefs } from "vue";
import { Toast } from "vant";
import { Post } from "@/service/activity";
import { useRouter, useRoute } from "vue-router";
import { uploadImgServer } from "@/service/activity";
import axios from "../utils/axios";

export default {
  name: "Post",
  components: {
    sHeader,
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const title = ref("");
    const postContent = ref("");
    const state = reactive({
      uploadImgServer,
      title: "",
      postContent: "",
      activityId: "",
      imgUrl: "#",
      id: "",
      detail: "",
    });

    onMounted(() => {
      init();
    });

    const init = async (values) => {
      title.value = values.title;
      postContent.value = values.postContent;
      // state.selectServiceId = state.service.normalServiceId;
    };
    const handleBeforeUpload = (file) => {
      const sufix = file.name.split(".")[1] || "";
      if (!["jpg", "jpeg", "png"].includes(sufix)) {
        Toast.error("请上传 jpg、jpeg、png 格式的图片");
        return false;
      }
    };
    // 上传图片
    const handleUrlSuccess = (val) => {
      state.imgUrl = val.data || "";
    };

    // 提交登录或注册表单
    const onSubmit = async () => {
      const { id } = route.query;
      await Post({
        title: title.value,
        postContent: postContent.value,
        activityId: id,
        imgUrl: state.imgUrl,
      });

      Toast.success("提交成功");
      router.back();
    };

    const afterRead = (file) => {
      console.log(file);
      const formData = new FormData();
      formData.append("file", file.file);
      uploadImgServer(formData).then((res) => {
        console.log(res);
        state.imgUrl = res.data;
      });
    };
    return {
      ...toRefs(state),
      handleBeforeUpload,
      onSubmit,
      handleUrlSuccess,
      afterRead,
      title,
      postContent

    };
  },

  data() {
    return {
      fileList: [], //默认是一个空数组
      imageData: {},
      isShow: false,
      showList: false,
    };
  },

  methods: {
    uploadImg(file) {
      console.log(file);
      let formData = new FormData();
      formData.append("file", file.file);
      axios
        .post("/mall/a/upload/file", formData) //填写url地址
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less">
@import "../common/style/mixin";
.input-up {
  padding: 0.26rem 0.18rem;
}
.input-up .upload {
  width: 100%;
  height: 200px;
  border: 1px solid #f5f5f5;
}
.input-up .upload span {
  display: block;
  text-align: center;
  font-size: 0.6rem;
  color: #d8d8d8;
}
.input-up .uploads {
  width: 1.4rem;
  height: 1.4rem;
  border: 1px solid #f5f5f5;
}
.input-up .uploads img {
  display: block;
  width: 100%;
  height: 1.4rem;
}
.input-up .upload p {
  text-align: center;
  font-size: 0.2rem;
  color: #d8d8d8;
}
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
    background: #fff;

    .cart-name {
      font-size: 14px;
    }
  }
}
.add {
  display: flex;
}
.add-container {
  flex: 1;
  height: 100%;
}
.avatar-uploader {
  width: 100px;
  height: 100px;
  color: #ddd;
  font-size: 30px;
}
.avatar-uploader-icon {
  display: block;
  width: 100%;
  height: 100%;
  border: 1px solid #e9e9e9;
  padding: 32px 17px;
}
</style>


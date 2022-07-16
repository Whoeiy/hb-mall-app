<template>
  <div class="cart-box">
    <s-header :name="'发布帖子'" :noback="faulse"></s-header>

    <div>
      <van-form @submit="onSubmit" :model="ruleForm" :rules="rules" ref="formRef">
        <van-field
            v-model="title"
            name="title"
            label="主题"
            placeholder="帖子的主题"
            :rules="[{ required: true, message: '请填写帖子的主题' }]"
        />
        <van-field
            style="height: 200px;margin-bottom: 0px"
            v-model="postContent"
            name="postContent"
            label="内容"
            placeholder="帖子的内容"
            :rules="[{ required: true, message: '请填写帖子的主要内容' }]"
        />
        <van-uploader
            :after-read="afterRead"
            v-model="fileList"
            multiple
            :max-count="1"
            :max-size="1080 * 2400"
            @oversize="onOversize"
        >

<!--          <van-uploader-->

<!--              :action="uploadImgServer"-->
<!--              accept="jpg,jpeg,png"-->
<!--              :headers="{-->
<!--            token: token-->
<!--          }"-->
<!--              :show-file-list="false"-->
<!--              :before-upload="handleBeforeUpload"-->
<!--              :on-success="handleUrlSuccess"-->
<!--          >-->
            <van-button style="width: 100%; height: 400px">点击此处上传帖子的主图</van-button>
          </van-uploader>

      </van-form>
      <van-button round block color="#ee1110" native-type="submit" style=" width:94%;position:fixed; bottom:10px;margin: 10px 10px 10px 10px;"
     onclick="onsubmit()"
      >发布</van-button
      >
    </div>

  </div>


</template>
<script>
import sHeader from "@/components/SimpleHeader";
import {reactive, toRefs,ref,} from "vue";
import {Toast} from "vant";
import { Post} from "@/service/activity";


export default {
  name: "Post",
  components: {
    sHeader,
  },
  methods:{
    //文件图片上传
    afterRead(fileObj) {
      // 上传状态
      this.fileLoading = true;
      fileObj.status = "uploading";
      // 状态提示
      fileObj.message = "上传中...";
      // 声明form表单数据
      const formData = new FormData();
      // 添加文件信息
      formData.append("file", fileObj.file);
      // 上传接口调用
      this.$api.Up_files(formData).then((res) => {
        // 存储返回数据
        console.log(res);
        this.turn.up_files.push(res.id);
        fileObj.status = "done";
        this.fileLoading = false;
        console.log(this.turn.up_files);
      }).catch((e) => {
        console.log(e, 11);
      });
    },

  },
  setup(){
    const formRef = ref(null)
    const state = reactive({

        imgUrl: "",
        postContent: "",
        title: "",
      id: "",

    });


    const onSubmit = async (values) => {
        await Post({

          title: values.title,
          activityId: state.id,
          imgUrl: values.imgUrl,
          postContent: values.postContent,
        });
        Toast.success("发布成功");
      }
    const handleBeforeUpload = (file) => {
      const sufix = file.name.split('.')[1] || ''
      if (!['jpg', 'jpeg', 'png'].includes(sufix)) {
        Toast.error('请上传 jpg、jpeg、png 格式的图片')
        return false
      }
    }
    // 上传图片
    const handleUrlSuccess = (val) => {
      state.ruleForm.url = val.data || ''
    }
    return {
      ...toRefs(state),
      formRef,
      onSubmit,
      handleBeforeUpload,
      handleUrlSuccess,

    };
  },

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
    background: #fff;

    .cart-name {
      font-size: 14px;
    }
  }}
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
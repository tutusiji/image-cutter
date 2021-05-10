<template>
  <view class="home">
    <image class="banner" src="../../static/banner2.png" />
    <!-- <view class="banner" :style="{ backgroundImage: `url(${banner})` }"></view> -->
    <uni-grid :column="3" :showBorder="false" borderColor="#000" class="list">
      <uni-grid-item class="grid-item" v-for="item in list" :key="item.name">
        <view class="item " @click="goAppPage(item.router)">
          <image class="icon" :src="`../../static/${item.icon}.svg`" />
          <text class="text">{{ item.name }}</text>
        </view>
      </uni-grid-item>
    </uni-grid>

    <!-- 消息提示 -->
    <uni-popup id="popup" ref="popup" :type="type" :animation="true">
      <view class="popup-content">{{ message }}</view>
    </uni-popup>
  </view>
</template>
<script>
import { uniGrid } from "@dcloudio/uni-ui";

export default {
  components: {
    uniGrid,
  },
  data() {
    return {
      list: [
        {
          icon: "icon-tupian",
          name: "长图合并",
          router: "/pages/index/merge",
        },
        {
          icon: "icon-hebing",
          name: "合并去重",
          router: "",
        },
        {
          icon: "icon-wenzi",
          name: "提取文字",
          router: "",
        },
        {
          icon: "icon-tx",
          name: "换个动漫头像",
          router: "",
        },
        {
          icon: "icon-zh",
          name: "动漫风格转换",
          router: "",
        },
        {
          icon: "icon-3d1",
          name: "变身3D动漫",
          router: "",
        },
        {
          icon: "icon-shuiyin",
          name: "去水印",
          router: "",
        },
        {
          icon: "icon-xf",
          name: "老照片修复",
          router: "",
        },
        {
          icon: "icon-xg",
          name: "旋转/裁剪",
          router: "",
        },
        {
          icon: "icon-zjz",
          name: "专业证件照",
          router: "",
        },
        {
          icon: "icon-yasuo",
          name: "图片压缩",
          router: "",
        },
        {
          icon: "icon-shengdan",
          name: "来顶圣诞帽",
          router: "",
        },
      ],
      type: "center",
      msgType: "success",
      message: "",
      banner: "../../static/banner2.jpg",
    };
  },
  methods: {
    goAppPage(url) {
      if (!url) {
        this.type = "center";
        this.message = "此功能开发中，请体验“长图合并”";
        this.$refs.popup.open();
      }
      uni.navigateTo({
        url,
      });
    },
  },
};
</script>

<style lang="scss">
.banner {
  width: 100%;
  height: 210rpx;
  // 	background-size: contain;
  //   background-repeat: no-repeat;
  //   background-position: center;
}
.list {
  .grid-item {
    height: 94px;
  }
  .item {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;

    .icon {
      width: 30px;
      height: 30px;
      margin-bottom: 10px;
    }
    .text {
      font-size: 14px;
      color: #333;
    }
  }
}
.popup-content {
  background-color: #fff;
  padding: 15px;
}
</style>

<template>
  <view class="home">
    <view class="imglist">
      <view
        class="item"
        :style="{ backgroundImage: `url(${item})` }"
        v-for="(item, index) in list"
        :src="item"
        :key="item"
        @click="showImg(item, index)"
      >
        <view class="num">{{ index + 1 }}</view>
      </view>
      <!-- <image v-for="item in list" :src="item" :key="item" /> -->
      <view class="plus" @click="chooseImg">
        <image class="img" src="../../static/icon-plus.svg" />
      </view>
    </view>

    <canvas
      class="canvas"
      style="width: 300px; height: 200px;"
      canvas-id="myCanvas"
      id="myCanvas"
    ></canvas>
  </view>
</template>
<script>
// import { uniGrid } from "@dcloudio/uni-ui";
//import uniBadge from '@dcloudio/uni-ui/lib/uni-badge/uni-badge.vue' //也可使用此方式引入组件
export default {
  data() {
    return {
      list: [],
    };
  },
  // components: { uniGrid },
  mounted() {
    this.ctx();
  },
  methods: {
    chooseImg() {
      const that = this;
      let arr = [];
      uni.chooseImage({
        count: 9, //默认9
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera "], //从相册选择
        success: function(res) {
          arr.push(JSON.stringify(res.tempFilePaths));
          console.log(res.tempFilePaths);
          that.list.push(...res.tempFilePaths);
        },
      });
    },
    showImg(path, index) {
      // 预览图片
      uni.previewImage({
        urls: this.list,
        current: index,
        longPressActions: {
          itemList: ["发送给朋友", "保存图片", "收藏"],
          success: function(data) {
            console.log(
              "选中了第" +
                (data.tapIndex + 1) +
                "个按钮,第" +
                (data.index + 1) +
                "张图片"
            );
          },
          fail: function(err) {
            console.log(err.errMsg);
          },
        },
      });
    },
    /**
     * 合并多张图片，返回新的图片
     * @param {Array} list 图片url数组
     * @param {Number} cwith 画布宽度 默认500
     * @param {Number} cheight 画布高度 默认500
     */
    mergeImgs(list, cwith = 500, cheight = 500) {
      return new Promise((resolve, reject) => {
        const baseList = [];

        const canvas = document.createElement("canvas");
        canvas.width = cwith;
        canvas.height = cheight * list.length;
        const context = canvas.getContext("2d");

        list.map((item, index) => {
          const img = new Image();
          img.src = item;
          // 跨域
          img.crossOrigin = "Anonymous";

          img.onload = () => {
            context.drawImage(img, 0, cheight * index, cwith, cheight);
            const base64 = canvas.toDataURL("image/png");
            baseList.push(base64);

            if (baseList[list.length - 1]) {
              console.log(baseList);
              // 返回新的图片
              resolve(baseList[list.length - 1]);
            }
          };
        });
      });
    },
    compoose() {
      this.mergeImgs(this.list).then((base64) => {
        const imgDom = document.createElement("img");
        imgDom.src = base64;
        document.body.appendChild(imgDom);
      });
    },
    ctx() {
      const ctx = uni.createCanvasContext("myCanvas");

      ctx.setFillStyle("red");
      ctx.fillRect(10, 10, 150, 100);
      ctx.draw();
      ctx.fillRect(50, 50, 150, 100);
      ctx.draw();
    },
  },
};
</script>

<style lang="scss">
.plus {
  display: inline-block;
  margin-top: 20px;
  margin-left: 0;
  width: 60px;
  height: 60px;
  border: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  .img {
    width: 30px;
    height: 30px;
  }
}
.imglist {
  padding: 20px 0 20px 10px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.item {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 100px;
  margin-right: 10px;
  margin-bottom: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  border: 1px solid #000;
  background-color: #fff;
  .num {
    position: absolute;
    top: -15px;
    left: 46%;
    font-size: 10px;
  }
}
.canvas {
  border: 1px solid #000;
}
</style>

<template>
    <view class="home">
        <view class="imglist">
            <view
                class="item"
                :style="{ backgroundImage: `url(${item.url})` }"
                v-for="(item, index) in list"
                :key="item.url"
                @click="showImg(item.url, index)"
            >
                <view class="num">{{ index + 1 }}</view>
            </view>
            <image
                class="showImg"
                :src="showUrl"
                v-show="showUrl"
                @click="showBigPhoto"
                :style="{ width: `${showPhoto.width * 0.5}px`, height: `${showPhoto.height * 0.5}px` }"
            />
            <view class="footer">
                <view class="plus" @click="chooseImg">
                    <image class="img" src="../../static/icon-plus.svg" />
                </view>
                <view class="combine" @click="mergeBtn">
                    合并
                </view>
            </view>
        </view>
        <view class="cvw">
            <canvas
                class="myCanvas"
                canvas-id="myCanvas"
                id="myCanvas"
                :style="{ width: `${cvsWidth}px`, height: `${cvsHeight}px` }"
            ></canvas>
        </view>
    </view>
</template>
<script>
import merge from "../mixins/merge"
// import { uniGrid } from "@dcloudio/uni-ui";
//import uniBadge from '@dcloudio/uni-ui/lib/uni-badge/uni-badge.vue' //也可使用此方式引入组件
export default {
    mixins: [merge],
    data() {
        return {
            list: [],
            cvsWidth: 820,
            cvsHeight: 0,
            showUrl: "",
            showPhoto: null
        }
    },
    // components: { uniGrid },
    mounted() {
        this.init()
    },
    methods: {
        chooseImg() {
            this.list = []
            this.cvsWidth = 320
            this.cvsHeight = 0
            this.showUrl = ""
            this.showPhoto = null
            const that = this
            let arr = []
            uni.chooseImage({
                count: 9, //默认9
                sizeType: ["compressed"], //可以指定是原图还是压缩图，默认二者都有 "original",
                sourceType: ["album", "camera "], //从相册选择
                success: async function(res) {
                    console.log(res.tempFilePaths)
                    // arr.push(JSON.stringify(res.tempFilePaths))
                    // arr.push(...res.tempFilePaths)
                    const promiseArr = res.tempFilePaths.map(
                        (item) =>
                            new Promise((resolve) => {
                                uni.getImageInfo({
                                    src: item,
                                    success: function(image) {
                                        // console.log(image)
                                        resolve({
                                            url: item,
                                            w: image.width,
                                            h: image.height
                                        })
                                    }
                                })
                            })
                    )
                    for (let i = 0; i < promiseArr.length; i++) {
                        const result = await promiseArr[i]
                        arr.push(result)
                    }
                    that.list.push(...arr)
                    console.log(that.list)
                },
                complete: function() {}
            })
        },
        showImg(path, index) {
            const arr = []
            this.list.filter((item) => {
                arr.push(item.url)
            })
            // 预览图片
            uni.previewImage({
                urls: arr,
                current: index,
                longPressActions: {
                    itemList: ["发送给朋友", "保存图片", "收藏"],
                    success: function(data) {
                        console.log(
                            "选中了第" + (data.tapIndex + 1) + "个按钮,第" + (data.index + 1) + "张图片"
                        )
                    },
                    fail: function(err) {
                        console.log(err.errMsg)
                    }
                }
            })
        },
        showBigPhoto() {
            uni.previewImage({
                urls: [this.showUrl]
            })
        },
        mergeBtn() {
            this.cvsWidth = 320
            this.cvsHeight = 0
            this.showUrl = ""
            this.showPhoto = null
            const ctx = uni.createCanvasContext("myCanvas")
            let cx = 0
            let cy = 0
            let cw = this.cvsWidth
            let ch = 0
            let itemH = 0
            this.list.forEach((item, index) => {
                itemH = (item.h * cw) / item.w
                let prevItem = index ? this.list[index - 1] : this.list[0]
                let prevH = (prevItem.h * cw) / prevItem.w
                cy = index ? cy + prevH : 0
                ch = itemH
                this.cvsHeight += itemH
                ctx.drawImage(item.url, cx, cy, cw, ch)

                console.log(cx, cy, cw, ch, this.cvsHeight)
            })
            ctx.draw(false, () => {
                const that = this
                console.log("===4===")
                uni.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: this.cvsWidth,
                    height: this.cvsHeight,
                    destWidth: this.cvsWidth,
                    destHeight: this.cvsHeight,
                    canvasId: "myCanvas",
                    fileType: "jpg",
                    success: function(res) {
                        // 在H5平台下，tempFilePath 为 base64
                        console.log("11", res.tempFilePath)
                        that.showUrl = res.tempFilePath
                        uni.getImageInfo({
                            src: res.tempFilePath,
                            success: function(image) {
                                console.log(image)
                                that.showPhoto = image
                            }
                        })
                    }
                })
            })
        }
    }
}
</script>

<style lang="scss">
.footer {
    position: fixed;
    bottom: 10px;
    right: 0;
}
.plus,
.combine {
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
    &:active {
        background-color: #bebebe;
    }
}
.plus {
    margin-right: 10px;
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
.myCanvas {
    visibility: hidden;
    // width: 80%;
    // height: 2000px;
    margin: 0 auto;
    border: 1px solid #000;
}
.showImg {
    display: block;
    width: 80%;
    margin: 0 auto;
}
.cvw {
    width: 0;
    height: 0;
    overflow: hidden;
}
</style>

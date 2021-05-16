export default {
	data() {
		return {
			timer: null
		}
	},
	// computed: {
	// 	pos() {
	// 		return JSON.stringify(this.position)
	// 	},
	// 	btn() {
	// 		return JSON.stringify(this.button)
	// 	}
	// },
	watch: {

	},
	created() {

	},
	mounted() {

	},
	beforeDestroy() {

	},
	methods: {
		initX() {
			console.log(123)
		},
		debounce(fn, delay, isImmediate) {
			var timer = null; //初始化timer，作为计时清除依据
			return function () {
				var context = this; //获取函数所在作用域this
				var args = arguments; //取得传入参数
				clearTimeout(timer);
				if (isImmediate && timer === null) {
					//时间间隔外立即执行
					fn.apply(context, args);
					timer = 0;
					return;
				}
				timer = setTimeout(function () {
					fn.apply(context, args);
					timer = null;
				}, delay);
			}
		}
	}
}
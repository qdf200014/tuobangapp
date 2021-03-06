export default {
	a: {},
	canDoFunction(e = {}) {
		if (!this.a[e.key]) {
			this.lockKey(e.key);
			e.success && e.success();
			if (e.time) {
				setTimeout(() => {
					this.releaseKey(e.key)
				}, e.time)
			}
		} else {
			e.fail && e.fail()
		}
	},
	releaseKey(key) {
		delete this.a[key]
	},
	lockKey(key) {
		this.a[key] = true
	}
}

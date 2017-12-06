var graphic_progress = {
    template: `
	<div class="marpad_info  graphic-progress-info">
		<div class="graphic_check">
			<danger></danger>
		</div>
	</div>
        `,
    data() {
        return {
            value1: '1',
            graphic_progress_info: [],
            handle: [],
            clickIndex: '', //点击对应的下标
            proCli: '', //点击对应的内容
            showflag: true
        }
    },
    components: {
        danger
    },
    methods: {

    },
}
const four_order = {
    template: `
        <div class="pro_index">
            <search-pro @dataRefresh="changeData"></search-pro>
            <div class="warning_center key_process marpad_info">
                    <ul class="clearfix ">
                            <li v-for="value in order_management_info">
                            <router-link  :to="value.link" @click.native="pop($event)">
                                <div class="changImg center-xy">
                                    <img :src="value.img">
                                    <p class="sL">{{value.title}}</p>
                                </div>
                            </router-link>
                            </li>
                    </ul>
            </div>
        </div>
    `,
    data() {
        return {
            value1: [],
            value2: [],
            data: [],
            data1: [],
            data3: [],
            order_management_info: [{
                'title': '沉桩令',
                'img': '../img/沉桩令.png',
                'link': '/project3/unit_project/piling_order',
            }, {
                'title': '挖土令',
                'img': '../img/挖土令.png',
                'link': '/project3/unit_project/digging_order',
            }, {
                'title': '浇灌令',
                'img': '../img/浇灌令.png',
                'link': '/project3/unit_project/Irrigation_order',
            }, {
                'title': '吊装令',
                'img': '../img/吊装令.png',
                'link': '/project3/unit_project/Irrigation_order',
            }]
        }
    },
    components: {
        searchPro
    },
    methods: {
        changeData() {},
        pop(event) {
            event.preventDefault();
            console.log(event);
            console.log(6);
            return false;

        }
    },
    mounted() {
        var that = this;
        new Promise(resolve => {
            $.ajax({
                url: '/projects/rest/project',
                success: function(data) {
                    resolve(data);
                }
            })
        }).then(data => {
            console.log(data);
            data.results.forEach(value => {
                let pro = {
                    label: value.PrjName,
                    value: value.id
                };
                that.data.push(pro);
            })
        })
    }
}
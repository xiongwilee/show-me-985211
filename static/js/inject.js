/**
 * 检索页面中所有出现985/211院校名称，并高亮
 * @author xiongwilee
 */
var ShowMe985211 = (function() {
    function showMe985211() {
        this.list = [
            '清华大学', '北京大学', '中国人民大学', '北京工业大学', '北京理工大学', '北京航空航天大学', '北京化工大学', '北京邮电大学', '对外经济贸易大学', '中国传媒大学', '中央民族大学', '中国矿业大学', '中央财经大学', '中国政法大学', '中国石油大学', '中央音乐学院', '北京体育大学', '北京外国语大学', '北京交通大学', '北京科技大学', '北京林业大学', '中国农业大学', '北京中医药大学', '华北电力大学', '北京师范大学', '中国地质大学', '复旦大学', '华东师范大学', '上海外国语大学', '上海大学', '同济大学', '华东理工大学', '东华大学', '上海财经大学', '上海交通大学', '南开大学', '天津大学', '天津医科大学', '河北工业大学', '重庆大学', '西南大学', '华北电力大学', '太原理工大学', '内蒙古大学', '大连理工大学', '东北大学', '辽宁大学', '大连海事大学', '吉林大学', '东北师范大学', '延边大学', '东北农业大学', '东北林业大学', '哈尔滨工业大学', '哈尔滨工程大学', '南京大学', '东南大学', '苏州大学', '河海大学', '中国药科大学', '中国矿业大学', '南京师范大学', '南京理工大学', '南京航空航天大学', '江南大学', '南京农业大学', '浙江大学', '安徽大学', '合肥工业大学', '中国科学技术大学', '厦门大学', '福州大学', '南昌大学', '山东大学', '中国海洋大学', '中国石油大学', '郑州大学', '武汉大学', '华中科技大学', '中国地质大学', '华中师范大学', '华中农业大学', '中南财经政法大学', '武汉理工大学', '湖南大学', '中南大学', '湖南师范大学', '中山大学', '暨南大学', '华南理工大学', '华南师范大学', '广西大学', '四川大学', '西南交通大学', '电子科技大学', '西南财经大学', '四川农业大学', '云南大学', '贵州大学', '西北大学', '西安交通大学', '西北工业大学', '陕西师范大学', '西北农林科大', '西安电子科技大学', '长安大学', '兰州大学', '新疆大学', '石河子大学', '海南大学', '宁夏大学', '青海大学', '西藏大学', '第二军医大学', '第四军医大学', '国防科学技术大学'
        ];

        this.config = {
            'www.zhipin.com': {
            	// 类名
                className: 'show_me_985211',
                // 是否延迟，不配置则不延迟
                timer: 2000,
                // 获取列表的选择器
                domListSelector: 'a[data-suid]'
            }
        };
    }

    showMe985211.prototype.init = function() {
        // 载入CSS
        this.initCSS();
        // 设置头部：标题等
        this.render();
    };
    showMe985211.prototype.render = function() {
        var me = this;

        var itemCfg = me.config[window.location.host];
        if (itemCfg.timer) {
            setInterval(function() {
                me.generator.call(me, itemCfg);
            }, itemCfg.timer);
        } else {
            me.generator(itemCfg);
        }

    };
    showMe985211.prototype.generator = function(config) {
        var me = this;
        var domList = me.selectDom(config.className, config.domListSelector);
        if (!domList || domList.length === 0) return;

        domList.forEach(function(item) {
            item.classList.add(config.className);
        });
    };
    showMe985211.prototype.selectDom = function(className, domListSelector) {
        var me = this;

        var domList = document.querySelectorAll(domListSelector);
        var matchList = [];
        if (domList.length === 0) return matchList;

        domList.forEach(function(item) {
            if (item.classList.contains(className)) return;

            var text = item.innerText;

            if (!text) return;

            // 如果包含this.list中的文字则说明匹配到了985211院校
            if (me.list.some(function(subItem) { return text.indexOf(subItem) > -1; })) {
                matchList.push(item);
            }
        });

        return matchList;

    };
    /**
     * 载入CSS
     */
    showMe985211.prototype.initCSS = function() {
        this.linkDOM = this.linkDOM || document.createElement('link');
        this.linkDOM.rel = 'stylesheet';
        this.linkDOM.href = chrome.extension.getURL('static/css/inject.css');

        // 把link文件放在</body>和</html>之间，以避免回车搜索时干掉DOM
        document.body.parentElement.appendChild(this.linkDOM);
    };

    return (new showMe985211());
})();

ShowMe985211.init();
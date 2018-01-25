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
        // 是否严格匹配
        isStrict: false,
        // 是否延迟，不配置则不延迟
        timer: 2000,
        // 获取列表的选择器
        domListSelector: 'a[data-suid]',
        // 匹配到list之后的回调
        onAfterMatchAll: function(domList) {
          var domLen = domList.length;

          if (domLen < 1) return;

          var confirmText = '找到了' + domLen + '个符合条件的候选人，是否自动打招呼？' + '\n' +
            '(不自动打招呼系统也可以帮您自动高亮符合要求的候选人)';
          if (window.confirm(confirmText)) {
            domList.forEach(function(item) {
              var sayHiDom = item.parentElement.querySelector('.btn-greet');
              if (sayHiDom && sayHiDom.click) {
                sayHiDom.click();
              }
            });
          }
        },
        // 匹配到其中一个item之后的回调
        onAfterMatchItem: function(item) {
          var text = item.parentElement.innerText;
          if (text.indexOf("继续沟通") > -1) {
            return false;
          }

          return true;
        }
      },
      'easy.lagou.com': {
        // 类名
        className: 'show_me_985211',
        // 是否严格匹配
        isStrict: true,
        // 是否延迟，不配置则不延迟
        timer: false,
        // 获取列表的选择器
        domListSelector: '.result_list_item',
        // 匹配到list之后的回调
        onAfterMatchAll: function(domList) {
          var domLen = domList.length;
          // 通过URL中的positionname或者keyword字段来匹配职位名称
          var keyWord = this.search.positionname || this.search.keyword || '';

          function auto(index) {
            var domItem = domList[index];
            if (!domItem) return;

            // 获取“和TA联系”的按钮，并点击
            var addChatBtn = domItem.querySelector('.add-chat-list');
            if (addChatBtn && addChatBtn.click) { addChatBtn.click(); }

            // 一秒钟之后查询页面中的职位并模拟点击发送
            setTimeout(function() {
              var positionMode = document.getElementById('chatWithTaPop');
              if (!positionMode || positionMode.style.display == 'none') return;

              var positionList = positionMode.querySelectorAll('.position-item');
              if (!positionList || positionList.length == 0) return;

              var positionItem;
              for (var i = 0; i < positionList.length; i++) {
                positionItem = positionList[i];
                if (positionItem.innerText.indexOf(keyWord) > -1) {
                  break;
                }
              }

              // 选中职位
              // 可以通过URL中的positionname参数来指定职位
              if (!positionItem || !positionItem.click) return;
              positionItem.click();

              // 发送职位
              var sendChatBtn = positionMode.querySelector('.can-click');
              if (!sendChatBtn || !sendChatBtn.click) return;
              sendChatBtn.click();

              // 500ms之后递归执行
              setTimeout(function() {
                auto(index + 1);
              }, 500);
            }, 1000);
          }

          if (domLen < 1) return;

          var confirmText = '职位：' + keyWord + '\n' +
            '找到了' + domLen + '个符合条件的候选人，是否自动“和TA聊聊”？' + '\n' +
            '(点击“取消”也会帮您自动高亮符合要求的候选人)';
          if (window.confirm(confirmText)) {
            auto(0);
          }
        },
        // 匹配到其中一个item之后的回调
        onAfterMatchItem: function(item) {},
        // 在自定义判断之前获取到了一个item之后的回调
        onBeforeMatchItem: function(item) {
          var text = item.innerText;
          if (text.indexOf("继续聊聊") > -1) {
            return false;
          }

          var spreadOutDetailBtn = item.querySelector('.spreadIn');
          if (spreadOutDetailBtn && spreadOutDetailBtn.click) {
            spreadOutDetailBtn.click();
          }
        }
      }
    };

    this.itemCfg = this.config[window.location.host];
  }

  showMe985211.prototype.init = function() {
    // 获取请求权参数
    this.search = this.queryParse();

    // 载入CSS
    this.initCSS();

    // 设置头部：标题等
    this.render();
  };
  showMe985211.prototype.render = function() {
    var me = this;

    if (me.itemCfg.timer) {
      setInterval(function() {
        me.generator.call(me, me.itemCfg);
      }, me.itemCfg.timer);
    } else {
      me.generator(me.itemCfg);
    }

  };
  showMe985211.prototype.generator = function(config) {
    var me = this;
    var preDomList = me.selectDom(config.className, config.domListSelector);

    // 在单个钩子中增加判断逻辑
    var domList = preDomList.filter(function(item) {
      // 添加获取完成所有dom时候的钩子
      if (me.itemCfg.onAfterMatchItem) {
        return me.itemCfg.onAfterMatchItem.call(me, item) !== false;
      } else {
        return true;
      }
    });

    if (!domList || domList.length === 0) return;

    // 添加获取完成所有dom时候的钩子
    if (me.itemCfg.onAfterMatchAll) {
      me.itemCfg.onAfterMatchAll.call(me, domList);
    }

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

      if (me.itemCfg.onBeforeMatchItem) {
        if (me.itemCfg.onBeforeMatchItem.call(me, item) === false) return;
      }

      var text = item.innerText;

      if (!text) return;

      // 学历信息必须包含“本科、硕士、博士”
      if (!/本科|硕士|博士/g.test(text)) return;

      // 学历信息必须包含“专科”则直接返回
      if (me.itemCfg.isStrict && /大专/g.test(text)) return;

      // 如果包含this.list中的文字，则说明匹配到了985211院校
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


  /**
   * 解析获取当前页面的GET请求参数
   * @return {Object} 请求参数对象
   */
  showMe985211.prototype.queryParse = function(str) {
    // 页面url参数集合
    var dataObj = {};
    var url = str || window.location.href;
    // 正则会匹配 ?a=b&c=d
    url.replace(/([^?=&#]+)=([^?=&#]+)/g, function() {
      dataObj[arguments[1]] = decodeURIComponent(arguments[2]);
    });
    return dataObj;
  };

  return (new showMe985211());
})();

ShowMe985211.init();
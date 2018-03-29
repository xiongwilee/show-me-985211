/**
 * 检索页面中所有出现985/211院校名称，并高亮
 * @author xiongwilee
 */

window.showMe985211 = window.showMe985211 || {};

showMe985211.core = (function() {
  function core() {
    var me = this;

    me.appConfig = {};
    showMe985211.base.getConfig(function(val) {
      me.appConfig = val.config;
    });

    me.list = [];
    showMe985211.base.getWriteList(function(data) {
      me.list = data.lists;
    });

    this.globalConfig = {
      markedClass: 'show_me_985211_marked',
      escapedClass: 'show_me_985211_escaped',
      matchedClass: 'show_me_985211_matched'
    };

    this.config = {
      'www.zhipin.com': {
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

          function auto() {
            domList.forEach(function(item) {
              var sayHiDom = item.parentElement.querySelector('.btn-greet');
              if (sayHiDom && sayHiDom.click) {
                sayHiDom.click();
              }
            });
          }

          // 自动打招呼
          switch (me.appConfig.autoSayhi) {
            case 'confirm':
              var confirmText = '找到了' + domLen + '个符合条件的候选人，是否自动打招呼？' + '\n' +
                '(不自动打招呼系统也可以帮您自动高亮符合要求的候选人)';
              if (window.confirm(confirmText)) {
                auto();
              }
              break;
            case 'auto':
              auto();
              break;
            case 'never':
            default:
              // do nothing
              break;
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
        // 是否严格匹配
        isStrict: true,
        // 是否延迟，不配置则不延迟
        timer: 2000,
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

          // 自动打招呼
          switch (me.appConfig.autoSayhi) {
            case 'confirm':
              var confirmText = '职位：' + keyWord + '\n' +
                '找到了' + domLen + '个符合条件的候选人，是否自动“和TA聊聊”？' + '\n' +
                '(点击“取消”也会帮您自动高亮符合要求的候选人)';
              if (window.confirm(confirmText)) {
                auto(0);
              }
              break;
            case 'auto':
              auto(0);
              break;
            case 'never':
            default:
              // do nothing
              break;
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

  core.prototype.init = function() {
    var me = this;
    // 获取请求权参数
    this.search = showMe985211.base.queryParse();

    // 设置头部：标题等
    setTimeout(function() {
      me.render();
    }, 0)
  };
  core.prototype.render = function() {
    var me = this;

    if (me.itemCfg.timer) {
      setInterval(function() {
        me.generator.call(me, me.itemCfg);
      }, me.itemCfg.timer);
    } else {
      me.generator(me.itemCfg);
    }

  };
  core.prototype.generator = function(config) {
    var me = this;
    var preDomList = me.selectDom(config.domListSelector);

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
      item.classList.add(me.globalConfig.matchedClass);
    });
  };
  core.prototype.selectDom = function(domListSelector) {
    var me = this;

    var domList = document.querySelectorAll(domListSelector + ':not(.' + me.globalConfig.markedClass + ')');
    var matchList = [];
    if (domList.length === 0) return matchList;

    for(var i = 0; i<domList.length; i++){
      var item = domList[i];
      var result = checkMatch(item);

      if (!result.marked) {
        // 未标记过的列表添加标记标识
        item.classList.add(me.globalConfig.markedClass);

        if (result.matched) {
          matchList.push(item);
        } else {
          item.classList.add(me.globalConfig.escapedClass);
        }
      }
    }

    function checkMatch(item) {
      var result = {
        // 是否匹配到
        matched: false,
        // 是否以前标记过
        marked: false,
      }

      if (item.classList.contains(me.globalConfig.matchedClass)) {
        result.matched = true;
        result.marked = true;
        return result;
      }

      if (item.classList.contains(me.globalConfig.escapedClass)) {
        result.matched = false;
        result.marked = true;
        return result;
      }

      if (me.itemCfg.onBeforeMatchItem) {
        if (me.itemCfg.onBeforeMatchItem.call(me, item) === false) return result;
      }

      var text = item.innerText;

      if (!text) return result;

      // 学历信息必须包含“本科、硕士、博士”
      if (!/本科|硕士|博士/g.test(text)) return result;

      // 学历信息必须包含“专科”则直接返回
      if (me.itemCfg.isStrict && /大专/g.test(text)) return result;

      // 如果包含this.list中的文字，则说明匹配到了985211院校
      var isMatchWriteList = me.list.some(function(subItem) {
        return text.indexOf(subItem) > -1;
      });
      if (isMatchWriteList) {
        result.matched = true;
        return result;
      }

      return result;
    }

    return matchList;

  };

  return (new core());
})();

showMe985211.core.init();
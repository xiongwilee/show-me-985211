window.showMe985211 = window.showMe985211 || {};

showMe985211.base = (function() {
  function base() {

  }
  base.prototype.getConfig = function(callback) {
    chrome.storage.sync.get('config', function(val) {
      val = val || {};
      val.config = val.config || {
        cn: ['pro-985', 'pro-211'],
        global: 'top-300',
        manual: '-1',
        manualContent: '',
        autoSayhi: 'confirm'
      };

      callback(val);
    });
  }

  base.prototype.setConfig = function(config, callback) {
    chrome.storage.sync.set({ 'config': config }, function() {
      callback(config);
    });
  }

  base.prototype.getWriteList = function(callback) {
    var me = this;

    me.getColleges(function(data) {
      var cnCollegesData = data.cnCollegesData;
      var globalCollegesData = data.globalCollegesData;

      me.getConfig(function(conf) {
        var config = conf.config;

        var result = me.getByCollegesConfig(cnCollegesData, globalCollegesData, config) || {};

        callback(result)
      });
    })
  }

  base.prototype.getByCollegesConfig = function(cnCollegesData, globalCollegesData, config) {
    var lists = [],
      items = [];

    if (config.manual === 'replace') {
      // 清除不必要空格
      lists = splitText(config.manualContent);

      return {
        lists: lists,
        items: listToItem(lists)
      }
    }

    if (config.cn && config.cn.length > 0) {
      cnCollegesData.forEach(function(item) {
        if (arrInArr(item.tags, config.cn)) {
          items.push(item);
        }
      });
    }

    if (config.global && config.global != '-1') {
      globalCollegesData.forEach(function(item) {
        if (arrInArr(item.tags, [config.global])) {
          items.push(item);
        }
      });
    }

    var curLists, curItems;
    if (config.manual === 'add') {
      curLists = splitText(config.manualContent);
      curItems = listToItem(curLists);
      items = items.concat(curItems);
    }

    return {
      lists: itemToList(items),
      items: items
    }

    function splitText(text) {
      if (!text) return [];

      var result;
      if (text.indexOf(',') > 0) {
        result = text.split(',')
      } else if (text.indexOf(' ') > 0) {
        result = text.split(' ')
      } else {
        result = text.split('，')
      }

      return result;
    }

    function arrInArr(arr, subArr) {
      return subArr.every(function(item) {
        if (arr.indexOf(item) === -1) {
          return false;
        } else {
          return true;
        }
      })
    }

    function cleanList(lists) {
      if (!lists) return [];

      var result = [];
      lists.forEach(function(item) {
        item = item && item.replace(/\s/g, '');
        if (!item) return;

        result.push(item);
      });
      return result;
    }

    function listToItem(lists) {
      var result = [];
      lists.forEach(function(item) {
        if (!item) return;
        result.push({
          name: item.replace(/\s/g, '')
        })
      });
      return result;
    }

    function itemToList(items) {
      var result = [];

      items.forEach(function(item) {
        result.push(item.name);
        item.name_en && result.push(item.name_en);
      });

      return result;
    }
  }

  base.prototype.getColleges = function(callback) {
    var me = this;

    if (me.result) {
      return callback(me.result);
    }

    var cnCollegesUrl = chrome.extension.getURL('libs/data/colleges-cn.json');
    var globalCollegesUrl = chrome.extension.getURL('libs/data/colleges-global.json');

    var result = {
      cnCollegesData: false,
      globalCollegesData: false,
    };

    me.ajax({
      url: cnCollegesUrl,
      success: function(res) {
        result.cnCollegesData = res;
        checkResult();
      }
    });

    me.ajax({
      url: globalCollegesUrl,
      success: function(res) {
        result.globalCollegesData = res;
        checkResult();
      }
    });

    function checkResult() {
      if (!!result.cnCollegesData && !!result.globalCollegesData) {
        me.result = result;
        callback(result)
      }
    }
  };

  /**
   * 解析获取当前页面的GET请求参数
   * @return {Object} 请求参数对象
   */
  base.prototype.queryParse = function(str) {
    // 页面url参数集合
    var dataObj = {};
    var url = str || window.location.href;
    // 正则会匹配 ?a=b&c=d
    url.replace(/([^?=&#]+)=([^?=&#]+)/g, function() {
      dataObj[arguments[1]] = decodeURIComponent(arguments[2]);
    });
    return dataObj;
  };

  base.prototype.getParmeter = function(data) {
    var result = "";
    for (var key in data) {
      result = result + key + "=" + data[key] + "&";
    }
    /*将结果最后多余的&截取掉*/
    return result.slice(0, -1);
  };

  /**
   * [ajax description]
   * @param  {[type]} obj [description]
   * @return {[type]}     [description]
   * @example
   *
   * this.ajax({
   *   url:'',
   *   type:'',
   *   data: {},
   *   success:function(result){
   *       //code...
   *   }
   * });  
   */
  base.prototype.ajax = function(obj) {
    /*1.判断有没有传递参数，同时参数是否是一个对象*/
    if (obj == null || typeof obj != "object") {
      return false;
    }
    /*2.获取请求类型,如果没有传递请求方式，那么默认为get*/
    var type = obj.type || 'get';
    /*3.获取请求的url  location.pathname:就是指当前请求发起的路径*/
    var url = obj.url || location.pathname;
    /*4.获取请求传递的参数*/
    var data = obj.data || {};
    /*4.1获取拼接之后的参数*/
    data = this.getParmeter(data);
    /*5.获取请求传递的回调函数*/
    var success = obj.success || function() {};

    /*6:开始发起异步请求*/
    /*6.1:创建异步对象*/
    var xhr = new XMLHttpRequest();
    /*6.2:设置请求行,判断请求类型，以此决定是否需要拼接参数到url*/
    if (type == 'get') {
      url = url + "?" + data;
      /*重置参数，为post请求简化处理*/
      data = null;
    }
    xhr.open(type, url);
    /*6.2:设置请求头:判断请求方式，如果是post则进行设置*/
    if (type == "post") {
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }
    /*6.3:设置请求体,post请求则需要传递参数*/
    xhr.send(data);

    /*7.处理响应*/
    xhr.onreadystatechange = function() {
      /*8.判断响应是否成功*/
      if (xhr.status == 200 && xhr.readyState == 4) {
        /*客户端可用的响应结果*/
        var result = null;
        /*9.获取响应头Content-Type ---类型是字符串*/
        var grc = xhr.getResponseHeader("Content-Type");
        /*10.根据Content-Type类型来判断如何进行解析*/
        if (grc.indexOf("json") != -1) {
          /*转换为js对象*/
          result = JSON.parse(xhr.responseText);
        } else if (grc.indexOf("xml") != -1) {
          result = xhr.responseXML;
        } else {
          result = xhr.responseText;
        }
        /*11.拿到数据，调用客户端传递过来的回调函数*/
        success(result);
      }
    }

  }

  return (new base());
})();
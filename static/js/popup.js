(function() {
  var searchTimer;
  var appInfo = chrome.app.getDetails();

  var me = new Vue({
    el: '#app',
    data: function() {
      return {
        appInfo: appInfo,
        search: {
          name: ''
        },
        searchResult: [],
        form: {},
        cnCollegesData: [],
        cnColleges: [{
          value: 'pro-985'
        }, {
          value: 'pro-211'
        }],
        globalCollegesData: [],
        globalColleges: [{
          value: 'top-0'
        }, {
          value: 'top-50'
        }, {
          value: 'top-100'
        }, {
          value: 'top-300'
        }]
      }
    },
    watch: {
      'search.name': function(val) {
        clearTimeout(searchTimer);

        searchTimer = setTimeout(function() {
          me.getTagsByName(val);
        }, 500)
      }
    },
    filters: {
      tagMap: function(val, type) {
        type = type || 'text';

        var result = {
          'pro-985': { text: '985工程', theme: 'success' },
          'pro-211': { text: '211工程', theme: 'success' },

          'top-0': { text: '仅限大陆院校', theme: 'success' },
          'top-50': { text: '全球TOP 50', theme: 'success' },
          'top-100': { text: '全球TOP 100', theme: 'success' },
          'top-300': { text: '全球TOP 300', theme: 'success' },
          'top-500': { text: '全球TOP 500', theme: 'success' },
        }[val] || { text: '未知院校', theme: 'info' }

        return result[type];
      }
    },
    created: function() {
      showMe985211.base.getConfig(function(val) {
        var config = val.config;

        me.form = config;
      });


      showMe985211.base.getColleges(function(data) {
        me.cnCollegesData = data.cnCollegesData;
        me.globalCollegesData = data.globalCollegesData;
      });
    },
    methods: {
      getTagsByName: function(val) {
        var result = [];
        val = val.replace(/\s/g, '');

        if (!val) {
          me.searchResult = result;
          return;
        }

        for (var i = 0; i < me.cnCollegesData.length; i++) {
          var item = me.cnCollegesData[i];
          if (item.name == val || item.name_en == val) {
            var tags = me.getTagsByItem(item, 'cn');
            result = result.concat(tags);
            break;
          }
        }

        for (var i = 0; i < me.globalCollegesData.length; i++) {
          var item = me.globalCollegesData[i];
          if (item.name == val || item.name_en == val) {
            var tags = me.getTagsByItem(item, 'global');
            result = result.concat(tags);
            break;
          }
        }

        if (result.length === 0) {
          result = me.getTagsByItem(null);
        }

        me.searchResult = result;
      },
      getTagsByItem: function(item, type) {
        if (!item || !item.tags) return [{ value: 'none' }];

        var tags = [];
        // 如果是全球院校，则只获取tags中的第一个，
        // 比如：["top-50","top-100","top-300","top-500","top-1000"]，只取"top-50"
        if (type === 'global') {
          tags.push(item.tags[0]);
        } else {
          tags = tags.concat(item.tags);
        }

        var result = [];
        tags.forEach(function(item) {
          result.push({ value: item });
        });

        return result;
      },
      onSubmit: function() {
        showMe985211.base.setConfig(me.form, function() {
          me.$message({
            type: 'success',
            message: '设置已保存！',
            center: true
          });
        });
      },
      onCancel: function() {
        showMe985211.base.getConfig(function(val) {
          var config = val.config;
          
          me.form = config;
        });
      },
      onShowDetail: function() {
        return window.open('https://github.com/xiongwilee/show-me-985211#%E4%B8%89%E4%BD%BF%E7%94%A8%E6%96%B9%E6%B3%95');

        me.$message({
          message: '施工中，敬请期待！',
          center: true
        });
      }
    }
  })
})();
(function() {
  var searchTimer;
  var me = new Vue({
    el: '#app',
    data: function() {
      return {
        search: {
          name: ''
        },
        searchResult: [{
          theme: 'info',
          value: 'none'
        }, {
          theme: 'success',
          value: 'pro-985'
        }, {
          theme: 'success',
          value: 'pro-211'
        }],
        form: {
          cn: ['pro-985', 'pro-211'],
          global: 'top-300',
          manual: '-1',
          manualContent: ''
        },
        cnColleges: [{
          value: 'pro-985'
        }, {
          value: 'pro-211'
        }],
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
        }, 400)
      }
    },
    filters: {
      tagMap: function(val, type) {
        type = 'text';

        var result = {
          'pro-985': { text: '985工程', theme: 'sucess' },
          'pro-211': { text: '211工程', theme: 'sucess' },

          'top-0': { text: '仅限大陆院校', theme: 'sucess' },
          'top-50': { text: '全球TOP 50', theme: 'sucess' },
          'top-100': { text: '全球TOP 100', theme: 'sucess' },
          'top-300': { text: '全球TOP 300', theme: 'sucess' },
          'top-500': { text: '全球TOP 500', theme: 'sucess' },
        }[val] || { text: '未知院校', theme: 'info' }

        return result[type];
      }
    },
    methods: {
      getTagsByName: function(val) {
        console.log(val);
      },
      onSubmit: function() {
        console.log('submit!');
      },
      onShowDetail: function() {
        this.$message({
          message: '施工中，敬请期待！',
          center: true
        });
      }
    }
  })
})();
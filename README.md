# show me 985/211

<center style="margin: 50px">
<img src="http://img003.qufenqi.com/products/99/d2/99d2635a89e4164ba759f82cd6cb7533.png" width="120px">
</center>

快速确定该学校是不是985或211院校。

## 一、示例

1. 快速查询

![](http://img002.qufenqi.com/products/cc/3b/cc3b8388203e8034a0137e5fec50be4f.gif)

2. 在拉勾和BOSS直聘高亮最优候选人

![](http://img002.qufenqi.com/products/eb/ba/ebbac943380d0ac33131136efeb3debc.gif)

## 二、安装

### 方法一：手动安装

[https://pan.baidu.com/s/1__WbsC4jk64FPZXfwQp1mw](https://pan.baidu.com/s/1__WbsC4jk64FPZXfwQp1mw)

1. 访问上面的链接下载`show-me-985211-2.6.zip`文件；
2. 然后在chrome中打开`扩展程序`页 （ 可以直接访问：[chrome://extensions/](chrome://extensions/) ），打开`开发者模式`；
3. 将`show-me-985211-2.6.zip`解压后拖放到扩展程序页的任意位置即可完成安装

### 方法二：Chrome网上应用商店安装

[https://chrome.google.com/webstore/detail/show-me-985211/fpihkbimcgfjmflglfdobfefdkbmojop?hl=zh-CN](https://chrome.google.com/webstore/detail/show-me-985211/fpihkbimcgfjmflglfdobfefdkbmojop?hl=zh-CN)

1. 访问以上连接
2. 点击“添加至chrome”即可安装

## 三、使用方法

### 1、快速查询院校是否为985/211/全球排名

1. 点击浏览器右上角“show-me-985211”的图标；
2. 在“快速查询”栏中输入院校名称，即可查询；

### 2、配置院校白名单

1. 点击浏览器右上角“show-me-985211”的图标；
2. 在“院校配置”栏中，即可配置，简单说明如下；
    - **院校筛选** 是否做院校筛选，如果不做筛选，与院校相关的配置均无效，默认为筛选院校；
    - **中国大陆** 多选，“且”关系，比如：选中“985工程”和“211工程”，则筛选院校为985且211院校；
    - **全球** 单选，如果不想配置非大陆院校选中“仅限大陆院校即可”，另外，该项与“中国大陆”呈“或”的关系；
    - **自定义** `增量配置院校`：在上述配置基础上添加其他白名单院校；`替换配置院校`：忽略上述配置，独立配置院校；
    - **学历** 学历，包括：本科（学士）、硕士、博士，默认为至少本科；
    - **年龄** 是否限制年龄，默认为`不限`；
    - **打招呼** 自动打招呼时：`询问`（是否询问），`自动`（不询问，直接打招呼），`永不`（永不自动打招呼）；
3. 配置之后，打开“BOSS直聘”、“拉勾”的搜索人才的页面，就可以按照自己配置的院校高亮最优候选人了。

## 四、贡献

### 1、下载代码，安装依赖

可以直接clone代码：

```
$ git clone git@github.com:xiongwilee/show-me-985211.git
```

建议fork之后再，提PR。

安装依赖：
```
$ cd show-me-985211
$ npm install
```

启动开发模式：
```
$ npm run dev
```

### 2、开发调试

开发模式执行完之后，会在项目路目录下生成产出文件：
```
.
├── Gulpfile.js
├── README.md
├── _locales
├── dist        // 产出目录
├── icons
├── libs
├── manifest.json
├── node_modules
├── package.json
├── static
└── views
```

打开Chrome扩展程序页，[chrome://extensions/](chrome://extensions/) ，并打开开发者模式；然后将`dist`目录直接拖拽到当前页面即可。

此时你将看到这样的插件已经被安装了：
![](http://wx3.sinaimg.cn/large/7171171cgy1frs1rii2zgj21f00piafc.jpg)

**TIPS**:

1. 该插件包含两个核心部分：1）配置页面`views/popup.html`，2）注入到页面的JS`static/js/inject.js`；
2. Chrome浏览器插件开发可以参考：1）[官方文档](https://developer.chrome.com/extensions/getstarted)，2）[非官方中文文档](https://crxdoc-zh.appspot.com/extensions/getstarted)；
3. 修改`static/js/inject.js`之后没有生效，注意两点：1）是否编译成功，2）点击这个按钮刷新下试试：[](http://wx4.sinaimg.cn/large/7171171cgy1frs203mv7yj20n60dyjsk.jpg)
4. 测试注入到BOSS直聘及拉勾网的JS，需要实体的帐号，可以找你们的HR获取；
5. 别忘了修改`manifest.json`里的版本号；

### 3、发布

确认开发完成，并自测通过之后；可以执行`npm run build`，然后commit，提PR。

## 五、感谢

1. 感谢日志易HR: GraceWang同学
2. 感谢趣店HR: 金波同学

## 附：
1. 数据来源：
    - 世界大学排名：http://www.qianmu.org/ranking
    - 985工程院校：https://baike.baidu.com/wikitag/taglist?tagId=60825
    - 211工程院校：https://baike.baidu.com/wikitag/taglist?tagId=60826

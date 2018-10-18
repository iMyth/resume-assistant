# 超级简历

> iOS超级简历

## 安装依赖

``` bash
npm install
```

## 调试

- 网页调试

``` bash
npm run serve
```

- 真机调试

``` bash
npm run build
# 构建完成之后，复制dist目录到，入口文件Resume.js
```

## 发布

- Jenkins构建

``` bash
#!/bin/bash
# 构建文件 /script/build_testing-resume-assistant.sh
alias cnpm="npm --registry=https://registry.npm.taobao.org --cache=$HOME/.npm/.cache/cnpm  --disturl=https://npm.taobao.org/dist  --userconfig=$HOME/.cnpmrc"
curdir=`pwd`
cp -a  /data/node_modules_resume-assistant/node_modules/ ./
cd $curdir && cnpm install && cnpm run build
sudo rm -rf ./node_modules/ 

```

- Walle发布

(由于瓦力任务有修改，麻烦补充一下)

## 注意事项

- 仔细阅读文档，weex与web有些差异

- 部分特性可能文档没有可以参照：
 [源码](https://github.com/apache/incubator-weex/)  以及  [Weex UI](https://github.com/alibaba/weex)

- 部分已经踩过的坑

1. 无法使用less loader
2. 无法引入外部样式
3. 使用scoped css会出问题
4. 双向绑定，据说支持，然后使用中总有各种问题，改用单向绑定
5. mixins 无效，必须先使用 vuex-router-sync 才能让mixins生效，但是官方推荐使用navigator而非router
6. iOS9不支持部分ES6，ES7的写法
7. 指定一个active或者hover样式，必须同时指定初始样式，否则样式不会还原
8. flexbox布局存在问题无法铺满（新版可能已经解决这个问题）
9. list组件无法支持box-shadow
10. z-index无效，必须依靠先后关系实现层级布局
11. 调用内核对象不能太过频繁，会有崩溃的可能
12. v-if不支持 v-if="item in array"的写法
13. 缺乏调用子组件方法的合理机制
14. 渐变linear-gradient不支持百分比
15. 不支持动态添加的class
16. 事件机制比较诡异，当一个组件同时支持垂直水平滚动时，会导致外层事件完全失效，文档没有处理方法，但是可以在SDK里面找到
17. 部分动画，比如accordion收起展开，需要触发整个页面重绘，增加 needLayout: true 时会导致应用不稳定，有闪退风险
18. 动画使用bezier曲线，某些情况下会导致最后一两个像素收不回来，有固定边框的情况下会很明显
19. 关于排版，部分特殊符号不占排版空间，替换书签是计算的长度可能和实际文档中的长度不一致
20. 必须指定最外层容器高度，否则页面会整个不显示（可能新版已修复）
21. 欢迎补充，更多惊喜等你发现

## 项目结构说明
```
resume-assistant/
   |
   ├──android/                    * Android Playground
   ├──dist/                    * 构建目录
   ├──ios/                    * iOS Playground
   |
   ├──src/                * 所有Weex javascript 代码
   │   │
   │   │──abstract                 * 抽象公共方法，由于weex的机制，尚未支持
   │   │
   │   └──api                 * 服务端接口，以及一些工具方法
   │   │
   │   └──assets                  * 图片视频资源，由于无法引入css所以这里的css文件其实都无效
   │   │
   │   └──components                  * weex组件文件夹
   │   │
   │   └──core                  * 内核对象工具函数和业务逻辑代码
   │   │
   │   └──data                  * 应用需要的数据
   │   │
   │   └──filters                  * 过滤器
   │   │
   │   └──i18n                  * 多语言
   │   │
   │   └──init                  * 注册模块，平台相关，具体可咨询帅哥
   │   │
   │   └──loader                  * 目前只用来加载图片
   │   │
   │   └──store                  * vuex，暂没有找到支持vuex的方法，其实里面只有一个hack.js有效
   │   │
   │   └──views                  * 所有页面文件，网页调试使用路由模式，真机调试按文件入口拆分打包
   │  
   ├──*******              * 其他，略，参照通用vue项目

```

<p align="center">
    <a href="#">
        <img width="186" height="38" src="http://frame.sxjyonline.cn/SXWFrame/resources/images/logod.png">
    </a>
    <p align="center">生学教育-前端公共架构</p>
</p>

## 适用版本

pc版，成绩分析、云平台、课堂管控等

## 引用框架

- **基于node-servers** - 整个项目基于nodejs+express服务端，并且引用了常用中间件，如session、redis、mongoose、compression、fs。这样不同于传统前端html的好处是可以使用node服务端的技术（如果你需要的话）。
- **基于vue+webpack** - 整个项目引用了vue全家桶，包括vue-resource、vue-router、vuex、vue-loader等相关生态。
- **基于element-ui** - element-ui是目前pc端vue比较成熟的一套ui组件，在此基础上我们可以很方便的将自己的项目采用组件化管理。
- **使用yarn** - 采用yarn可以获得更稳定的项目版本控制和较快的速度。
- **使用gulp** - 引用gulp构建一些功能，如版本发布，打包等。

## vue-router-history

使用vue-router的"history"模式，配合node后端connect-history-api-fallback转发，实现url的仿静态化并且刷新留在当前路由。

## 浏览器兼容 `IE9+`

意味着你将抛弃IE8，当然这也是这种技术栈的特点。

## 如何使用（windows开发环境）？

1.下载代码并安装

```sh
$ git clone https://github.com/zhuxw0939/uyun-cli.git
$ yarn install
```

2.启动node主进程

```sh
$ yarn run windows
$ yarn run windows_supervisor (热更新启动方式)
```

3.启动webpack-server

```sh
$ yarn run dev
```

## 如何构建？

```sh
$ yarn run build
```

## 如何在线上发布版本？

```sh
$ linux todo
```

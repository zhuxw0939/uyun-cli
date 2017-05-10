<p align="center">
    <a href="#">
        <img width="486" height="300" src="http://www.uyun.net:3300/git_log.jpg">
    </a>
    <p align="center">Another project scaffold</p>
</p>

## What is this?

怎么在保证现有工作完成的情况下，又能跟上工具框架更新，研究新的技术概念、并思考其技术落地性？

## 有哪些特色？

- **基于node-servers** - 是的，整个项目基于nodejs+express服务端，并且引用了常用中间件，如session、redis、mongoose、compression、fs。这样不同于传统前端html的好处是可以使用node服务端的技术（如果你需要的话）。
- **基于vue+webpack** - 整个项目引用了vue全家桶，包括vue-resource、vue-router、vuex、vue-loader等相关生态。
- **基于element-ui** - element-ui是目前pc端vue比较成熟的一套ui组件，在此基础上我们可以很方便的将自己的项目采用组件化管理。
- **使用yarn** - 采用yarn可以获得更稳定的项目版本控制和较快的速度。
- **使用gaup** - 引用gaup构建一些功能，如版本发布，打包等。

### vue-router

使用vue-router的"history"模式，配合node后端connect-history-api-fallback转发，实现url的仿静态化并且刷新留在当前路由。

## 浏览器兼容 `gulpfile.js`

意味着你将抛弃IE8，当然这也是这种技术栈的特点。

## 示例项目

可以从以下链接获取更多项目参考:

- [gulp-changed](https://github.com/sindresorhus/gulp-changed) - only pass through changed files

## 如何使用？

下载代码，安装模块，使用pm2管理（通过app.json配置）。

```sh
$ git clone https://github.com/zhuxw0939/uyun-cli.git
$ yarn install
$ yarn start
```

dev控制台启动

```sh
cross-env NODE_ENV=development DEBUG=mydebug:* node ./app.js
```
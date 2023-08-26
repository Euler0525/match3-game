# 构建三消游戏

[TOC]

## 游戏设计

使用`PIXI.js`构建三消游戏，实现如下功能

- 本次项目构建的棋盘的大小为$9\times 9$；
- 实现基本功能：三个或三个以上相同的图块可以被消除，即从棋盘上移除，并落下随机产生的新图块填满棋盘；
- 增加评分功能：本次项目我设定每消除一个图块记$10$分；
- 增加关卡功能：每关的目标得分为$关卡数\times 500$，达到目标得分后进入下一关，初始记分$0$分，第二关开始每一关初始记分为$过关时刻分数 - 上一关目标得分$，即超出上一关目标分数的部分会被累计到下一关；
- 增加特殊宝石功能：棋盘中某个区域有$1\%$的概率会出现特殊图块，因为概率很小，所以大多数情况下是阻止其它图块连成直线。另外，如果三个或三个以上特殊图块相连，特殊图块被消除的同时它们所在的行和列的所有图块也会被消除，即特殊图块还能够帮助玩家快速过关
- 增加时间限制功能：随着关卡数增加，目标得分增加，时间限制也会响应调整，本项目设定每关的时间限制为$关卡数 \times 120秒$。如果超出时间未能达到目标分数，将会重新开始本关；

至此，本项目实现了要求的全部功能，具体的实现情况请见后文运行结果……

## 项目结构

本项目基于Pixi库和webpack模块打包器构建，使用Nodejs运行。

```shell
.
├── README.md
├── assets             # 本游戏所需的图片资源
│   ├── ...
├── img
│   ├── origin.png     # 游戏初始界面
│   ├── play.png       # 游戏过程界面
│   └── special.gif    # 特殊图块测试
├── index.html         # HTML页面
├── node_modules       # 第三方模块
│   ├──...
├── package-lock.json
├── package.json       # 项目元数据和依赖
├── result.mp4         # 游戏体验视频
├── src
│   ├── game           # 游戏源代码
│   │   ├── Board.js   # 棋盘
│   │   ├── CombinationManager.js  # 匹配和消除处理
│   │   ├── Config.js  # 配置加载
│   │   ├── Field.js   # 方块区域
│   │   ├── Game.js    # 游戏功能实现
│   │   └── Tile.js    # 图块处理
│   ├── index.js       # 入口文件
│   └── system
│       ├── App.js     # 游戏运行
│       └── Loader.js  # 预加载
└── webpack            # 模块打包
    ├── base.js
    └── prod.js
```

## 游戏说明

进入程序目录中，执行`npm start`

```shell
...\match3-game> npm start

> match3@1.0.0 start
> webpack-dev-server --config webpack/base.js --open

clean-webpack-plugin: options.output.path not defined. Plugin disabled...
<i> [webpack-dev-server] Project is running at:
<i> [webpack-dev-server] Loopback: http://localhost:8080/
...
webpack 5.88.2 compiled successfully in 2396 ms
```

出现上面输出的`localhost:8080`即为开始游戏，进入`localhost:8080`，出现下图界面，开始第一关的倒计时：

<img src="./img/origin.png" style="zoom:80%;" />

当用户开始操作界面，消除图块后，正式进入第一关，分数达到$关卡数\times 500$分后，进入下一关，以此类推……

<img src="./img/play.png" style="zoom:80%;" />

游戏界面如图，左上角显示关卡数和本关目标的分，右上角显示剩余时间，右下角显示当前得分。

本次游戏共有$7$种图块，其中$6$种为普通图块，“白色背景，圣诞狗”为特殊图块（出现概率为$1\%$）

## 运行结果

游戏过程请观看目录下的[result.mp4](./result.mp4)文件。

由于特殊图块出现的概率极小，为展示其功能，我修改了他出现的概率用作功能测试，现已改回$1\%$，测试结果如下：

![](./img/special.gif)

> 参考资料：
>
> [https://github.com/Zainking/LearningPixi](https://github.com/Zainking/LearningPixi)
>
> [https://gamedev.land/pixi_project_template/](https://gamedev.land/pixi_project_template/)
>
> [https://gamedev.land/match3/](https://gamedev.land/match3/)

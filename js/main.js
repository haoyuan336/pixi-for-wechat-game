import * as PIXI from './libs/pixi.min'
import defines from './defines'
import GameWorld from './game-world'
import resources from './resources'
// 47.104.67.84  服务器地址
const Main = function(){
    console.log('main');

    let app = new PIXI.Application({width: defines.designSize.width, height: defines.designSize.height, view: canvas});
    let stage = new PIXI.Container();

    let _currentTime = new Date().getTime();
    let _gameWorld = undefined;
    const update = function () {
        let currentTime = new Date().getTime();
        let d = currentTime - _currentTime;
        _currentTime = currentTime;
        if (_gameWorld){
            _gameWorld.update(d);
        }
    };


    const referFrame = function () {
        update();
        app.renderer.render(stage);
        requestAnimationFrame(referFrame, app.view);
    };
    referFrame();


    for (let i in resources){
        let str = 'http://47.104.67.84:3000' + resources[i];
        console.log('加载' + str);
        PIXI.loader.add(resources[i],str);
    }
    PIXI.loader.load((loader, res)=>{
        window.resouces = res;
        console.log('资源加载完毕');
        _gameWorld = GameWorld();
        stage.addChild(_gameWorld.node);
    });

    wx.login({
        success: function () {
            console.log('登陆成功');
            wx.getUserInfo({
                fail: function (res) {
                    // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                    if (res.errMsg.indexOf('auth deny') > -1 ||     res.errMsg.indexOf('auth denied') > -1 ) {
                        // 处理用户拒绝授权的情况
                    }
                },
                success: function (res) {
                    let rawData = JSON.parse(res.rawData);
                    // console.log('获取用户信息成功' + JSON.stringify(rawData.nickName));
                    let nickName = rawData.nickName;
                    let avatarUrl = rawData.avatarUrl;
                    if (_gameWorld){
                        _gameWorld.initPlayerInfo(nickName, avatarUrl);
                    }
                }
            })
        }
    });
    wx.onShareAppMessage(function () {
        // 用户点击了“转发”按钮
        return {
            title: '转发标题'
        }
    });

};
export default Main;
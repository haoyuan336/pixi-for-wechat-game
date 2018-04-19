import * as PIXI from './libs/pixi.min'
import defines from './defines'
const GameState  =  {
    Invalide: -1,
    Run: 1,
    Dead: 2
};
const GameWorld = function () {
    let that = {};
    that.node = new PIXI.Container();
    let _bgList = [];
    let _state = GameState.Invalide;
    let _speed = 0;
    let _acc = 0.0025;
    for (let i = 0 ; i < 2 ; i ++){
        let bg = new PIXI.Sprite.fromImage(defines.resPath + 'bg.png');
        that.node.addChild(bg);
        console.log('width = ' + bg.width);
        _bgList.push(bg);
        bg.position = {
            x: bg.width * i,
            y: 0
        }
    }
    let _towersList = [];

    let _bird = new PIXI.Sprite.fromImage(defines.resPath + 'bird.png');
    that.node.addChild(_bird);
    _bird.anchor = {
        x: 0.5,
        y: 0.5
    };
    _bird.position = {
        x: defines.designSize.width * 0.5,
        y: defines.designSize.height * 0.5
    };

    //添加碰撞柱子


    const addTower = function () {
        let towerImage = ["pipeDown.png", "pipeUp.png"];
        for (let i  = 0 ; i < 3 ; i ++){
            let list = [];
            let offsetY = Math.random() * (defines.designSize.height - 280) + 140;
            for (let j = 0 ; j < 2 ; j ++){
                let tower = new PIXI.Sprite.fromImage(defines.resPath + towerImage[j]);
                that.node.addChild(tower);
                let y = 0;
                if (j ===0){
                    y = offsetY - tower.height   - 70
                }else {
                    y = offsetY + 70
                }
                tower.position = {
                    x: defines.designSize.width * 1.5 + 200 * i,
                    y: y
                };
                list.push(tower);
            }
            _towersList.push(list);
        }

    };

    //点击屏幕即可加载柱子
    const jump = function () {
        _speed = - 0.6;
    };
    const setState = function (state) {
        if (_state === state){
            return
        }
        switch (state){
            case GameState.Run:
                if (_towersList.length === 0){
                    addTower();
                    jump();
                }
                break;
            case GameState.Dead:



                break;
            default:
                break;
        }
        _state = state;
    };

    wx.onTouchStart((e)=>{
        console.log('on touch start');
        if (GameState.Invalide === _state){
            setState(GameState.Run);
        }else if (_state === GameState.Run){
            jump();
        }
    });
    wx.onTouchMove((e)=>{
        console.log('on touch move');
    });
    wx.onTouchEnd((e)=>{
        console.log('on touch end');
    });
    wx.onTouchCancel((e)=>{
        console.log('on touch cancel');
    });
    window.TouchEvent = function () {
        // console.log('touch event');
    };
    window.MouseEvent  = function () {
        // console.log('move event');
    };

    that.update = function (dt) {

        if (_state === GameState.Run){
            _bird.position = {
                x: _bird.position.x,
                y: _bird.position.y + _speed * dt
            };
            _speed += _acc * dt;
            if (_bird.position.y + _bird.height * 0.5 > defines.designSize.height){
                console.log('collision bottom');
                setState(GameState.Dead);
            }else if (_bird.position.y - _bird.height * 0.5 < 0){
                console.log('collision top');
                setState(GameState.Dead);
            }
        }

        for (let i = 0 ; i < _bgList.length ; i ++){
            _bgList[i].position = {
                x: _bgList[i].position.x - 2,
                y: 0
            };
        }
        for (let i = 0 ; i < _bgList.length ; i ++){
            if ((_bgList[i].position.x + _bgList[i].width) <= 0){
                _bgList[i].position = {
                    x: _bgList[i].width,
                    y: 0
                }
            }
        }


        for (let i = 0 ; i < _towersList.length ; i ++){
            let list = _towersList[i];
            for (let j = 0 ; j < list.length; j ++){
                list[j].position = {
                    x: list[j].position.x - 2,
                    y: list[j].position.y
                }
            }
        }
        for (let i = 0 ; i < _towersList.length ; i ++){
            let list = _towersList[i];
            if ((list[0].position.x + list[0].width) < 0){
                let offsetY = Math.random() * (defines.designSize.height - 280) + 140;
                for (let j = 0 ; j < list.length ; j ++){
                    let y = 0;
                    if (j ===0){
                        y = offsetY - list[j].height   - 70
                    }else {
                        y = offsetY + 70
                    }
                    list[j].position = {
                        x: defines.designSize.width* 1.5 - list[j].width + 200,
                        y: y
                    }
                }
            }
        }
    };

    return that;
};
export default GameWorld;
import * as PIXI from './libs/pixi.min'
import defines from './defines'
const GameWorld = function () {
    let that = {};
    that.node = new PIXI.Container();
    let _bgList = [];
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
                    y = offsetY - tower.height   - 50
                }else {
                    y = offsetY + 50
                }
                tower.position = {
                    x: defines.designSize.width * 1.5 + 140 * i,
                    y: y
                };
                list.push(tower);
            }
            _towersList.push(list);
        }

    };

    //点击屏幕即可加载柱子
    // that.node.on('');

    const _touchBegin = function () {
        console.log('touch began');
    };
    const _touchMoved = function () {
        console.log('touch move');
    };
    const _touchCancel = function () {
        console.log('touch cancel');
    };
    const _touchEnd = function () {
        console.log('touch end');
    };
    const _onClick = function () {
        console.log('click')
    };
    (()=> {
        that.node.on("mousedown", _touchBegin)
            .on("mousemove", _touchMoved)
            .on("mouseout", _touchCancel)
            .on("mouseup", _touchEnd)
            .on("touchstart", _touchBegin)
            .on("touchmove", _touchMoved)
            .on("touchendoutside", _touchCancel)
            .on("touchend", _touchEnd)
            .on("click", _onClick)
            .on("tap", _onClick);
    })();


    that.update = function () {
        for (let i = 0 ; i < _bgList.length ; i ++){
            _bgList[i].position = {
                x: _bgList[i].position.x - 1,
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
                    x: list[j].position.x - 1,
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
                        y = offsetY - list[j].height   - 50
                    }else {
                        y = offsetY + 50
                    }
                    list[j].position = {
                        x: defines.designSize.width * 1.5 - list[j].width + 140,
                        y: y
                    }
                }
            }
        }

    };
    return that;
};
export default GameWorld;
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






    that.update = function (dt) {
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

    };
    return that;
};
export default GameWorld;
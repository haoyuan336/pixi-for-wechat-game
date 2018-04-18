import * as PIXI from './libs/pixi.min'
import defines from './defines'
const GameWorld = function () {
    let that = {};
    that.node = new PIXI.Container();
    let _bgList = [];
    for (let i = 0 ; i < 2 ; i ++){
        let bg = new PIXI.Sprite.fromImage(defines.resPath + 'bg.png');
        that.node.addChild(bg);
        bg.anchor = {
            x: 0.5,
            y: 0.5
        };
        console.log('width = ' + bg.width);
        bg.position = {
            x: defines.designSize.width * 0.5 + bg.width * i,
            y: defines.designSize.height * 0.5
        };
        _bgList.push(bg);
    }
    that.update = function () {
        for (let i = 0 ; i < _bgList.length ; i ++){
            _bgList[i].position = {
                x: _bgList[i].position.x - 1,
                y: defines.designSize.height * 0.5
            }
        }
    };
    return that;
};
export default GameWorld;
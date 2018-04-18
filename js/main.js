import * as PIXI from './libs/pixi.min'
import defines from './defines'
import GameWorld from './game-world'
import resources from './resources'
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
        PIXI.loader.add(resources[i], resources[i]);
    }
    PIXI.loader.load((loader, res)=>{
        window.resouces = res;
        console.log('资源加载完毕');
        _gameWorld = GameWorld();
        stage.addChild(_gameWorld.node);
    });



};
export default Main;
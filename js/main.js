import * as PIXI from './libs/pixi.min'
import defines from './defines'
import GameWorld from './game-world'
const Main = function(){
    console.log('main');

    let app = new PIXI.Application({width: defines.designSize.width, height: defines.designSize.height, view: canvas});
    let stage = new PIXI.Container();



    let sp = new PIXI.Sprite.fromImage(defines.resPath + 'bg.png');
    stage.addChild(sp);

    const update = function (dt) {
        console.log('dt  =' + dt);
        sp.position = {
            x: sp.position.x - 1 * dt,
            y: sp.position.y
        }
    };
    app.ticker.add(update);

    const referFrame = function () {
        app.renderer.render(stage);
        requestAnimationFrame(referFrame, app.view);
    };
    referFrame();

};
export default Main;
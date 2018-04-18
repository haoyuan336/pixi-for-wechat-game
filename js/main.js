import * as PIXI from './libs/pixi.min'
import defines from './defines'
import GameWorld from './game-world'
export default class Main {
    constructor() {
        console.log('inner height = ' + window.innerHeight);
        console.log('inner width = ' + window.innerWidth);
        this.app = new PIXI.Application({width: defines.designSize.width, height: defines.designSize.height, view: canvas, color: 0xffffff});
        this.stage = new PIXI.Container();

        // let scale = window.innerWidth / defines.designSize.width;
        // this.stage.scale = {
        //     x: scale,
        //     y: scale
        // };

        this.gameWorld = GameWorld();
        this.stage.addChild(this.gameWorld.node);
        requestAnimationFrame(this.update.bind(this), this.app.view);
    }

    start() {

    }

    update() {

        if (this.gameWorld){
            this.gameWorld.update();
        }
        this.app.renderer.render(this.stage);
        requestAnimationFrame(this.update.bind(this), this.app.view);
    }
}
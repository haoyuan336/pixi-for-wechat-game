import * as PIXI from './libs/pixi.min'

export default class Main {
    constructor() {
        this.app = new PIXI.Application({width: 720, height: 1280, view: canvas, color: 0xffffff});
        this.stage = new PIXI.Container();
        let sp = new PIXI.Sprite.fromImage('./images/bg.jpg');
        this.stage.addChild(sp);
        sp.anchor = {
            x: 0.5,
            y: 0.5
        };
        sp.position = {
            x: 100,
            y: 100
        };
        requestAnimationFrame(this.update.bind(this), this.app.view);
    }

    start() {

    }

    update() {
        this.app.renderer.render(this.stage);
        requestAnimationFrame(this.update.bind(this), this.app.view);
    }
}
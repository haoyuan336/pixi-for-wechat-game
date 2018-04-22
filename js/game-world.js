import * as PIXI from './libs/pixi.min'
import defines from './defines'
import resources from './resources'
import * as SAT from './libs/SAT'
const GameState = {
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
    for (let i = 0; i < 2; i++) {
        let bg = new PIXI.Sprite(window.resouces[resources.bg].texture);
        that.node.addChild(bg);
        console.log('width = ' + bg.width);
        _bgList.push(bg);
        bg.position = {
            x: bg.width * i,
            y: 0
        }
    }
    let _towersList = [];

    let _bird = new PIXI.Sprite(window.resouces[resources.bird].texture);
    _bird.zIndex = 1;
    that.node.addChild(_bird);
    _bird.anchor = {
        x: 0.5,
        y: 0.5
    };

    _bird.position = {
        x: defines.designSize.width * 0.5,
        y: defines.designSize.height * 0.5
    };
    _bird.circle = new SAT.Circle(new SAT.Vector(_bird.position.x, _bird.position.y), _bird.width * 0.3);
    _bird.graphics = new PIXI.Graphics();
    that.node.addChild(_bird.graphics);
    _bird.graphics.beginFill('#000000', 0.5);
    _bird.graphics.zIndex = 1;
    _bird.graphics.drawCircle(_bird.circle.pos.x, _bird.circle.pos.y, _bird.circle.r);

    //添加碰撞柱子

    let _headImage = undefined;
    that.initPlayerInfo = function (nickName, avatarUrl) {
        console.log('昵称' + nickName);
        console.log('头像' + avatarUrl);

        let headImage = new PIXI.Sprite.fromImage(avatarUrl);
        that.node.addChild(headImage);
        headImage.zIndex = 10;
        _headImage = headImage;
        //加上一个昵称
        let nickNameLabel = new PIXI.Text('ID:' + nickName, {
            fontFamily: 'Arial',
            fontSize: 10,
            fill: '#ffffff'
        });

        that.node.addChild(nickNameLabel);
        nickNameLabel.zIndex =10;
        nickNameLabel.position = {
            x: 10,
            y: 55
        };
        sortChildNode(that.node);
    };


    const sortChildNode = function (node) {
        let children = node.children;
        children.sort((a,b)=>{
            if (!a.zIndex){
                a.zIndex = 0;
            }
            if (!b.zIndex){
                b.zIndex = 0;
            }

            console.log('排序');
            return a.zIndex - b.zIndex;
        })
    };


    const addTower = function () {
        let towerImage = ["pipeDown", "pipeUp"];
        for (let i = 0; i < 3; i++) {
            let list = [];
            let offsetY = Math.random() * (defines.designSize.height - 280) + 140;
            for (let j = 0; j < 2; j++) {
                let tower = new PIXI.Sprite(window.resouces[resources[towerImage[j]]].texture);
                tower.zIndex = 1;
                that.node.addChild(tower);
                let y = 0;
                if (j === 0) {
                    y = offsetY - tower.height - 70
                } else {
                    y = offsetY + 70
                }
                tower.position = {
                    x: defines.designSize.width * 1.5 + 200 * i,
                    y: y
                };

                tower.polygon = new SAT.Polygon(new SAT.Vector(tower.position.x, tower.position.y),[
                    new SAT.Vector(tower.position.x, tower.position.y),
                    new SAT.Vector(tower.position.x + tower.width, tower.position.y),
                    new SAT.Vector(tower.position.x + tower.width, tower.position.y + tower.height),
                    new SAT.Vector(tower.position.x , tower.position.y + tower.height)
                ]);
                tower.graphics = new PIXI.Graphics();
                that.node.addChild(tower.graphics);
                tower.graphics.zIndex = 2;
                list.push(tower);
            }
            _towersList.push(list);
        }
        sortChildNode(that.node);
    };

    //点击屏幕即可加载柱子
    const jump = function () {
        _speed = -0.6;
    };
    const setState = function (state) {
        if (_state === state) {
            return
        }
        switch (state) {
            case GameState.Run:
                if (_towersList.length === 0) {
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

    wx.onTouchStart((e)=> {
        if (GameState.Invalide === _state) {
            setState(GameState.Run);
        } else if (_state === GameState.Run) {
            jump();
        }
    });
    wx.onTouchMove((e)=> {
    });
    wx.onTouchEnd((e)=> {
    });
    wx.onTouchCancel((e)=> {
    });
    window.TouchEvent = function () {
        // console.log('touch event');
    };
    window.MouseEvent = function () {
        // console.log('move event');
    };

    const updatePolygonPos = function (node) {
        let polygon = node.polygon;
        polygon.setPoints([
            new SAT.Vector(node.position.x, node.position.y),
            new SAT.Vector(node.position.x + node.width, node.position.y),
            new SAT.Vector(node.position.x + node.width, node.position.y + node.height),
            new SAT.Vector(node.position.x , node.position.y + node.height)]);
        let graphics = node.graphics;
        graphics.clear();
        graphics.beginFill('#ff0000', 0.5);
        let posList = [];
        for (let i = 0 ; i < polygon.points.length ; i ++){
            let point = polygon.points[i];
            posList.push(new PIXI.Point(point.x, point.y));
        }
        graphics.drawPolygon(posList);
    };
    that.update = function (dt) {

        if (_headImage && _headImage.width !== 1 && _headImage.scale.x === 1){
            console.log('head image width = ' + _headImage.width);
            _headImage.scale = {
                x: 40 / _headImage.width,
                y: 40 / _headImage.height
            };
            _headImage.position = {
                x: 10,
                y: 10
            }
        }
        if (_state === GameState.Run) {
            _bird.position = {
                x: _bird.position.x,
                y: _bird.position.y + _speed * dt
            };
            _bird.circle.pos = _bird.position;
            _bird.graphics.clear();
            _bird.graphics.beginFill('#000000', 0.5);
            _bird.graphics.drawCircle(_bird.circle.pos.x, _bird.circle.pos.y,  _bird.circle.r);


            _speed += _acc * dt;
            if (_bird.position.y + _bird.height * 0.5 > defines.designSize.height) {
                console.log('collision bottom');
                setState(GameState.Dead);
            } else if (_bird.position.y - _bird.height * 0.5 < 0) {
                console.log('collision top');
                setState(GameState.Dead);
            }
        }
        if (_state === GameState.Run) {
            for (let i = 0; i < _bgList.length; i++) {
                _bgList[i].position = {
                    x: _bgList[i].position.x - 2,
                    y: 0
                };
            }
            for (let i = 0; i < _bgList.length; i++) {
                if ((_bgList[i].position.x + _bgList[i].width) <= 0) {
                    _bgList[i].position = {
                        x: _bgList[i].width,
                        y: 0
                    }
                }
            }

            for (let i = 0; i < _towersList.length; i++) {
                let list = _towersList[i];
                for (let j = 0; j < list.length; j++) {
                    list[j].position = {
                        x: list[j].position.x - 2,
                        y: list[j].position.y
                    };
                    updatePolygonPos(list[j]);
                }
            }
            for (let i = 0; i < _towersList.length; i++) {
                let list = _towersList[i];
                if ((list[0].position.x + list[0].width) < 0) {
                    let offsetY = Math.random() * (defines.designSize.height - 280) + 140;
                    for (let j = 0; j < list.length; j++) {
                        let y = 0;
                        if (j === 0) {
                            y = offsetY - list[j].height - 70
                        } else {
                            y = offsetY + 70
                        }
                        list[j].position = {
                            x: defines.designSize.width * 1.5 - list[j].width + 200,
                            y: y
                        }
                    }
                }
            }
            testCollision();
        }
    };

    const testCollision = function () {
        for (let i = 0 ; i < _towersList.length ; i ++){
            for (let j = 0 ; j < _towersList[i].length ; j ++){
                let tower = _towersList[i][j];
                if (SAT.testCirclePolygon(_bird.circle, tower.polygon, new SAT.Response())){
                    console.log('碰撞');
                }else {
                }
            }
        }

    };

    return that;
};
export default GameWorld;
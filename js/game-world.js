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
    const _initSpeed = -10;
    const _bgSpeed = 2;
    let _acc = 0.6;
    let _score = 0;
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
    _bird.zIndex = 11;
    that.node.addChild(_bird);
    _bird.anchor = {
        x: 0.5,
        y: 0.5
    };

    _bird.position = {
        x: defines.designSize.width * 0.5,
        y: defines.designSize.height * 0.5
    };

    let _scoreText = new PIXI.Text('0', {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 0xffffff
    });
    _scoreText.zIndex = 20;
    _scoreText.anchor.set(0.5);
    _scoreText.position = {
        x: defines.designSize.width * 0.5,
        y: defines.designSize.height * 0.2
    };
    that.node.addChild(_scoreText);
    //添加碰撞柱子

    let _headImage = undefined;
    that.initPlayerInfo = function (nickName, avatarUrl) {
        console.log('昵称' + nickName);
        console.log('头像' + avatarUrl);

        let headImage = new PIXI.Sprite.fromImage(avatarUrl);
        that.node.addChild(headImage);
        headImage.zIndex = 10;
        _headImage = headImage;
        _headImage.visible = false;
        setTimeout(()=> {
            _headImage.visible = true;
            console.log('width = ' + headImage.width);
            headImage.scale.set(60 / headImage.width);
        }, 1000);
        //加上一个昵称
        let nickNameLabel = new PIXI.Text('ID:' + nickName, {
            fontFamily: 'Arial',
            fontSize: 10,
            fill: '#ffffff'
        });

        that.node.addChild(nickNameLabel);
        nickNameLabel.zIndex = 10;
        nickNameLabel.position = {
            x: 10,
            y: 55
        };
        sortChildNode(that.node);
    };


    const sortChildNode = function (node) {
        let children = node.children;
        children.sort((a, b)=> {
            if (!a.zIndex) {
                a.zIndex = 0;
            }
            if (!b.zIndex) {
                b.zIndex = 0;
            }

            console.log('排序');
            return a.zIndex - b.zIndex;
        })
    };


    const moveTower = function (dt) {
        for (let i = 0; i < _towersList.length; i++) {
            let towers = _towersList[i];
            towers[0].position = {
                x: towers[0].position.x - dt * _bgSpeed,
                y: towers[0].position.y
            };

            towers[1].position = {
                x: towers[1].position.x - dt * _bgSpeed,
                y: towers[1].position.y
            };
            if (towers[1].position.x < _bird.position.x && towers.score === 1) {
                _score += towers.score;
                towers.score = 0;
            }
        }
        _scoreText.text = _score + '';
        for (let i = 0; i < _towersList.length; i++) {
            let list = _towersList[i];
            if ((list[0].position.x + list[0].width) < 0) {
                list.score = 1;
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
    }
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

                list.push(tower);
            }
            list.score = 1;
            _towersList.push(list);
        }
        sortChildNode(that.node);
    };

    //点击屏幕即可加载柱子
    const jump = function () {
        _speed = _initSpeed;
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
    const update = function (dt) {
        if (_state === GameState.Run) {
            _bird.position = {
                x: _bird.position.x,
                y: _bird.position.y + _speed * dt
            };
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
                    x: _bgList[i].position.x - dt * _bgSpeed,
                    y: 0
                };
            }
            let maxRight = 0;
            for (let i = 0; i < _bgList.length; i++) {
                if (_bgList[i].position.x > maxRight) {
                    maxRight = _bgList[i].position.x;
                }
            }
            for (let i = 0; i < _bgList.length; i++) {
                let bg = _bgList[i];
                if (bg.position.x + bg.width < 0) {
                    bg.position = {
                        x: maxRight + bg.width - dt * 2 * _bgSpeed,
                        y: 0
                    }
                }
            }
            moveTower(dt);
            testCollision();
        }
    };

    that.update = update;


    const testCollision = function () {
        for (let i = 0; i < _towersList.length; i++) {
            for (let j = 0; j < _towersList[i].length; j++) {
                let tower = _towersList[i][j];
                if (boxesIntersect(_bird, tower)) {
                    setState(GameState.Dead);
                }
            }
        }
    };
    const boxesIntersect = function (a, b) {
        let aa = a.getBounds();
        let bb = b.getBounds();
        return aa.x + aa.width * 0.6 > bb.x && aa.x < bb.x + bb.width && aa.y + aa.height * 0.6 > bb.y && aa.y < bb.y + bb.height;
    };
    return that;
};
export default GameWorld;
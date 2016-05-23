import {res} from '../resource';
import GameHelper from '../helper/GameHelper';
import * as Promise from 'bluebird'
import * as _ from 'lodash';
import AppConstants, {clearAppConstants} from '../AppConstants';

let terrainPoints = [];
let segmentWidth = 5;
let bricks = [];
export default class TankWatchLayer extends cc.Layer {
    sprite: any;
    constructor() {
        super();
        this.showGame(this);
        this.addInfoBar(this, '');
        this.drawTerrain();
        console.log(terrainPoints.length)
        this.removeCircle(terrainPoints[200].x,terrainPoints[200].y);
        //this.removeBrick(AppConstants.DEVICE_WIDTH/2,AppConstants.DEVICE_HEIGHT*0.3);
        // this.gaussian();
        //this.test();
    }
    
    showGame(parent: cc.Node) {
        let tanks, tankToHide, flagPos: number, flag: cc.Node, correctTank: cc.Node;
        let action = cc.sequence([
            cc.delayTime(1),
            cc.callFunc(() => {
                [correctTank] = this.addTanks(this, 1);
                ({ flag, position: flagPos } = this.showFlag(this));
            }, parent),
            cc.delayTime(2),
            cc.callFunc(() => {
                correctTank.removeFromParent();
                flag.removeFromParent();
            }, parent),
        ]);

        parent.runAction(action);
        setTimeout(() => {
            console.log(flag, flagPos);
        }, 1500);
    }

    showLine(parent: cc.Node): void {
        let linePoints = [
            { from: cc.p(0, 0), to: cc.p(AppConstants.DEVICE_WIDTH, AppConstants.DEVICE_HEIGHT) },
            { from: cc.p(0, AppConstants.DEVICE_HEIGHT), to: cc.p(AppConstants.DEVICE_WIDTH, 0) },
            { from: cc.p(0, AppConstants.DEVICE_HEIGHT / 2), to: cc.p(AppConstants.DEVICE_WIDTH, AppConstants.DEVICE_HEIGHT / 2) },
            { from: cc.p(AppConstants.DEVICE_WIDTH / 2, 0), to: cc.p(AppConstants.DEVICE_WIDTH / 2, AppConstants.DEVICE_HEIGHT) }
        ]
        for (let i = 0; i < 4; i++) {
            let line = new cc.DrawNode();
            this.drawDottedLine(line, linePoints[i].from, linePoints[i].to, 1, cc.color('#ffffff'), 10);
            parent.addChild(line);
        }
    }

    showCountDown(parent: cc.Node): Promise<any> {
        return new Promise<any>(function (resolve, reject) {
            let countDown = GameHelper.makeTTFFont('3', AppConstants.MAIN_FONT, GameHelper.hexToRgb('#ffffff'), AppConstants.FONT_NORMAL, cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER, null);
            countDown.x = AppConstants.DEVICE_WIDTH / 2;
            countDown.y = AppConstants.DEVICE_HEIGHT / 2;
            parent.addChild(countDown);
        });
    }

    showFlag(parent: cc.Node): { flag: cc.Node, position: number } {
        //Possible value of the flag can be 0-7
        let x1 = Math.random() * AppConstants.DEVICE_WIDTH * 0.35 + AppConstants.DEVICE_WIDTH * 0.1; //Get random value from width 10% to 35%;
        let x2 = Math.random() * AppConstants.DEVICE_WIDTH * 0.25 + AppConstants.DEVICE_WIDTH * 0.65; //Get random value from width 65% to 90%;

        let y1 = Math.random() * AppConstants.DEVICE_HEIGHT * 0.35 + AppConstants.DEVICE_HEIGHT * 0.1; //Get random value from height 10% to 35%;
        let y2 = Math.random() * AppConstants.DEVICE_HEIGHT * 0.25 + AppConstants.DEVICE_HEIGHT * 0.65; //Get random value from height 65% to 90%;


        let flag = flax.assetsManager.createDisplay(res.tankwatch_plist, "flag" + Math.round(Math.random()));
        parent.addChild(flag);
        flag.x = Math.round(Math.random()) ? x1 : x2;
        flag.y = Math.round(Math.random()) ? y1 : y2;

        //possible positions 0,1 2,3 4,5 6,7
        // 6,7 (1,0)     0,1 (0,0)
        // 5,4 (1,1)     3,2 (0,1)
        // for finding positions first divide in quadarants
        // 0 = -ve
        // 1 = +ve
        let t1 = flag.x > AppConstants.DEVICE_WIDTH / 2 ? 0 : 1;
        let t2 = flag.y > AppConstants.DEVICE_HEIGHT / 2 ? 0 : 1;

        let possiblePoints;
        if (t1)
            if (t2)
                possiblePoints = [4, 5];
            else
                possiblePoints = [6, 7];
        else
            if (t2)
                possiblePoints = [2, 3];
            else
                possiblePoints = [0, 1];

        let pointOfRefrence = cc.p(AppConstants.DEVICE_WIDTH / 2, AppConstants.DEVICE_HEIGHT / 2);

        let flagSlope = this.slope(pointOfRefrence, cc.p(flag.x, flag.y));
        let position: number, centerSlope: number;
        switch (possiblePoints[0]) {
            case 0:
                centerSlope = this.slope(pointOfRefrence, cc.p(AppConstants.DEVICE_WIDTH, AppConstants.DEVICE_HEIGHT));
                position = flagSlope > centerSlope ? 0 : 1;
                break;
            case 2:
                centerSlope = this.slope(pointOfRefrence, cc.p(AppConstants.DEVICE_WIDTH, 0));
                position = flagSlope > centerSlope ? 2 : 3;
                break;
            case 4:
                centerSlope = this.slope(pointOfRefrence, cc.p(0, 0));
                position = flagSlope > centerSlope ? 4 : 5;
                break;
            case 6:
                centerSlope = this.slope(pointOfRefrence, cc.p(0, AppConstants.DEVICE_HEIGHT));
                position = flagSlope > centerSlope ? 6 : 7;
                break;
        }

        // console.log('Flag Position', flag.getPosition(), possiblePoints, position);
        return { flag, position };
    }

    addInfoBar(parent: cc.Node, text: string): { infoLabel: cc.Node, infoLayer: cc.Node } {
        let infoLayer = new cc.LayerColor(GameHelper.hexToRgb('#1D382D'), AppConstants.DEVICE_WIDTH, AppConstants.DEVICE_HEIGHT * 0.1);
        console.log(infoLayer);
        parent.addChild(infoLayer);

        let infoLabel = GameHelper.makeTTFFont(text, AppConstants.MAIN_FONT, GameHelper.hexToRgb('#ffffff'), AppConstants.FONT_LARGE, cc.TEXT_ALIGNMENT_CENTER, cc.TEXT_ALIGNMENT_CENTER, null);
        infoLabel.x = infoLayer.width / 2;
        infoLabel.y = infoLayer.height / 2;
        infoLayer.addChild(infoLabel);

        return { infoLabel, infoLayer };
    }
    
    drawTerrain() {
        let hill_points = [];
        hill_points[0] = cc.p(0,cc.random0To1()*AppConstants.DEVICE_HEIGHT*0.3+AppConstants.DEVICE_HEIGHT*0.4);
        var total_hills = 4;
        var gap_between_hills = AppConstants.DEVICE_WIDTH/total_hills;
        // hill_points[1] = cc.p(AppConstants.DEVICE_HEIGHT/2,AppConstants.DEVICE_HEIGHT/2);
        // hill_points[2] = cc.p(AppConstants.DEVICE_WIDTH,AppConstants.DEVICE_HEIGHT/5);
        terrainPoints.push(cc.p(0,0));
        var line = new cc.DrawNode();
        for(var index=1;index<=total_hills;index++) {
            
            // Generate Hills
            let height = cc.random0To1()*AppConstants.DEVICE_HEIGHT*0.3+AppConstants.DEVICE_HEIGHT*0.4;
            hill_points[index] = cc.p(index*gap_between_hills,height);
            console.log(hill_points[index]+"-------------");
            this.drawCurves(hill_points[index-1],hill_points[index]);
            
        }
        terrainPoints.push(cc.p(AppConstants.DEVICE_WIDTH,0));  
        // line.drawPoly(terrainPoints,cc.color(0,128,0),0,cc.color(255,255,255));
        // this.addChild(line);
    }               
    
    drawCurves(p0 :cc.Point, p1: cc.Point) {
        var hillSegments = Math.floor((p1.x-p0.x)/segmentWidth);
        var ymid = (p1.y + p0.y)/2;
        var amplitude = (p0.y - p1.y)/2;
        var dx = (p1.x - p0.x)/hillSegments;
        var delta = Math.PI/hillSegments;
        //let line = new cc.DrawNode(); 
        var point0 =  cc.p(0,0);
        var point1 = cc.p(0,0); 
        point0 = cc.p(p0.x,p0.y);
        // line.drawSegment(point0,cc.p(0.0),2,cc)
        var count=0;
        for(var i=1;i<=hillSegments;i++) {
            point1.x = p0.x+i*dx;    
            point1.y = ymid+amplitude*Math.cos(i*delta);
            terrainPoints.push(point0);
            // line.drawSegment(point0,point1,2,cc.color(255,255,255));
            //this.fillBrick(point0.x,point0.y);
            point0 = cc.p(point1.x,point1.y);   
       }
       
        // line.drawPoly(terrainPoints,cc.color(0,128,0),1,cc.color(255,255,255));
        // this.addChild(line);
    }
    
    fillBrick(x,y) {
        // let brick = flax.assetsManager.createDisplay(res.terrain_plist,"greenbox.jpg");
        console.log("---------"+y+"---------------");
        let brick_sprite = new cc.Sprite(res.terrain_brick);
        let scale_size_x = segmentWidth/brick_sprite.width;
        let scale_size_y = 0.1;
        var total_bricks = Math.floor(y/(brick_sprite.height*scale_size_y));
        for(var i=0;i<total_bricks;i++) {
            let brick = new cc.Sprite(res.terrain_brick);
            brick.setScaleX(scale_size_x);
            brick.setScaleY(scale_size_y);
            brick.setAnchorPoint(0.5,0);
            brick.x = x;
            brick.y = i*(brick.height*scale_size_y);
            bricks.push(brick);
            this.addChild(brick);
        }
        
    }
    
    removeCircle(x0,y0) {
        let radius = 100;
        let collision_point =0;
        var change_index = [];
        var line = new cc.DrawNode();
        for(var j=0;j<bricks.length;j++) {
            let x1 = terrainPoints[j].x; 
            if((x1-x0)<=segmentWidth) {   
                collision_point = j;
                break;
            }
        }
        collision_point = 400;
        var index = collision_point;
        var key = terrainPoints[collision_point];
        while (key.x-terrainPoints[index].x<=radius) {
            change_index.push(index);
            index--;
            if(index<0||index>terrainPoints.length)
                break;
        }
        index = collision_point+1;
        while (terrainPoints[index].x-key.x<=radius) {
            change_index.push(index);
            index++;
            if(index<0||index>terrainPoints.length)
                break;
        }
        for(let i=0;i<change_index.length;i++) {
            var point = terrainPoints[change_index[i]];
            point.y = point.y-(Math.sqrt((radius*radius)-(key.x-point.x)*(key.x-point.x)))
            console.log(point);  
        }
        line.drawPoly(terrainPoints,cc.color(0,128,0),1,cc.color(255,255,255));
        this.addChild(line);
       
        
        
            
    }
    
    test(){
        var line = new cc.DrawNode();
        var source = cc.p(AppConstants.DEVICE_WIDTH*0.1,AppConstants.DEVICE_HEIGHT/2);
        var dest = cc.p(AppConstants.DEVICE_WIDTH*0.5,AppConstants.DEVICE_HEIGHT/2);
        var control = cc.p(AppConstants.DEVICE_WIDTH*0.3,0);
        line.drawQuadBezier(source,control,dest,10,1,cc.color(255,255,255));
        this.addChild(line);
    }
    
    
    slope(p1: cc.Point, p2: cc.Point): number {
        return (p2.y - p1.y) / (p2.x - p1.x);
    }

    addTanks(parent: cc.Node, numberOfTank: number = 2): cc.Node[] {
        //Add Both the tanks
        let tanks = []
        let tankToHide: number;
        if (numberOfTank === 1) {
            tankToHide = Math.round(Math.random()) //return 0 or 1
        }
        for (let i = 0; i < 2; i++) {
            let tank = flax.assetsManager.createDisplay(res.tankwatch_plist, "tank" + i);
            tank.attr({
                x: AppConstants.DEVICE_WIDTH / 2,
                y: AppConstants.DEVICE_HEIGHT / 2
            });
            if (tankToHide === i)
                continue;
            else if (numberOfTank === 2)
                //Spacing between both tanks
                if (i) {
                    tank.x -= tank.width / 2;
                } else {
                    tank.x += tank.width / 2;
                }

            tanks.push(tank);
            parent.addChild(tank);
        }

        return tanks;
    }

    drawDottedLine(drawNode: cc.DrawNode, from: cc.Point, to: cc.Point, lineWidth?: number, color?: cc.Color, spacing: number = 6) {
        let coveredLine = cc.p(from.x, from.y);
        let maxLength = Math.sqrt(Math.pow((coveredLine.y - to.y), 2) + Math.pow((coveredLine.x - to.x), 2));
        let coveredLength = 0;
        while (coveredLength < maxLength) {
            if (color.a === 255)
                color.a = 0;
            else
                color.a = 255;

            let length = Math.sqrt(Math.pow((coveredLine.y - to.y), 2) + Math.pow((coveredLine.x - to.x), 2));
            let ratio = spacing / length;
            coveredLength += spacing;
            let x = ratio * to.x + (1 - ratio) * coveredLine.x;
            let y = ratio * to.y + (1 - ratio) * coveredLine.y;
            drawNode.drawSegment(coveredLine, cc.p(x, y), lineWidth, color);
            coveredLine.x = x;
            coveredLine.y = y;
        }
    }
    
}
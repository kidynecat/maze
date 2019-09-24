/**
* 系统方法
*/
import layaText = laya.display.Text;
class Sys {
	constructor() {

	}
	//打字
	public static createText(printtext: string): Laya.Text {
		var txt: Laya.Text = new Laya.Text();
		txt.text = printtext;
		//txt.borderColor = "#ffff00";
		//设置宽高以后的自动裁剪会按照这个区域裁剪
		//txt.size(300, 50);
		txt.fontSize = 20;
		txt.color = "#ff0000";
		txt.overflow = layaText.VISIBLE;
		txt.x = 10
		txt.y = 600
		Laya.stage.addChild(txt);
		return txt;
	}
	//画格子
	public static drawMapUnit(drawType: string, sp: Laya.Sprite, ps: PathStep, unitsize: number, fillColor: any, lineColor: any = null, lineWidth: number = 1): void {
		//格子r
		if (drawType.indexOf('r') >= 0)
			sp.graphics.drawRect(ps.X * unitsize, ps.Y * unitsize, unitsize, unitsize, fillColor, null, 0);
		//箭头a
		if (drawType.indexOf('a') >= 0)
			if (ps.PD == PathDirection.top) {
				//this.sp.graphics.drawPoly(ps.X * unitsize, ps.Y * unitsize, [0, unitsize, unitsize * 0.5, 0, unitsize, unitsize], "#006599");
				sp.loadImage("image/上.jpg", ps.X * unitsize + 1, ps.Y * unitsize + 1, unitsize - 2, unitsize - 2);
			}
			else if (ps.PD == PathDirection.right) {
				//this.sp.graphics.drawPoly(ps.X * unitsize, ps.Y * unitsize, [0, 0, 0, unitsize, unitsize, unitsize * 0.5], "#006599");
				sp.loadImage("image/右.jpg", ps.X * unitsize + 1, ps.Y * unitsize + 1, unitsize - 2, unitsize - 2);
			}
			else if (ps.PD == PathDirection.bottom) {
				//this.sp.graphics.drawPoly(ps.X * unitsize, ps.Y * unitsize, [unitsize, 0, 0, 0, unitsize * 0.5, unitsize], "#006599");
				sp.loadImage("image/下.jpg", ps.X * unitsize + 1, ps.Y * unitsize + 1, unitsize - 2, unitsize - 2);
			}
			else if (ps.PD == PathDirection.left) {
				//this.sp.graphics.drawPoly(ps.X * unitsize, ps.Y * unitsize, [unitsize, 0, 0, unitsize * 0.5, unitsize, unitsize], "#006599");
				sp.loadImage("image/左.jpg", ps.X * unitsize + 1, ps.Y * unitsize + 1, unitsize - 2, unitsize - 2);
			}
		//墙w
		if (drawType.indexOf('w') >= 0) {
			if (ps.mapUnitBorder.top == true) {
				sp.graphics.drawLine(ps.X * unitsize, ps.Y * unitsize, ps.X * unitsize + unitsize, ps.Y * unitsize, lineColor, lineWidth);
			}
			if (ps.mapUnitBorder.right == true) {
				sp.graphics.drawLine(ps.X * unitsize + unitsize, ps.Y * unitsize, ps.X * unitsize + unitsize, ps.Y * unitsize + unitsize, lineColor, lineWidth);
			}
			if (ps.mapUnitBorder.bottom == true) {
				sp.graphics.drawLine(ps.X * unitsize, ps.Y * unitsize + unitsize, ps.X * unitsize + unitsize, ps.Y * unitsize + unitsize, lineColor, lineWidth);
			}
			if (ps.mapUnitBorder.left == true) {
				sp.graphics.drawLine(ps.X * unitsize, ps.Y * unitsize, ps.X * unitsize, ps.Y * unitsize + unitsize, lineColor, lineWidth);
			}
		}
		//起点s
		if(drawType.indexOf('s') >= 0){
			sp.graphics.drawCircle(ps.X * unitsize + unitsize/2, ps.Y * unitsize + unitsize/2,(unitsize/2 -2),fillColor,lineColor,lineWidth);
		}

		//终点e
		if(drawType.indexOf('e') >= 0){
			sp.graphics.drawCircle(ps.X * unitsize + unitsize/2, ps.Y * unitsize + unitsize/2,(unitsize/2 -2),fillColor,lineColor,lineWidth);
		}

		//过程p
		if(drawType.indexOf('p') >= 0){
			sp.graphics.drawCircle(ps.X * unitsize + unitsize/2, ps.Y * unitsize + unitsize/2,unitsize/4,fillColor,lineColor,lineWidth);
		}
	}

}





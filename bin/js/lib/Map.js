var MapUnitBorder = /** @class */ (function () {
    function MapUnitBorder() {
        this.bottom = true;
        this.top = true;
        this.right = true;
        this.left = true;
    }
    return MapUnitBorder;
}());
var Line = /** @class */ (function () {
    function Line(_a, _b, _direct) {
        this.a = _a;
        this.b = _b;
        this.direct = _direct;
    }
    return Line;
}());
var PathStep = /** @class */ (function () {
    function PathStep(x, y, pd) {
        if (pd === void 0) { pd = PathDirection.center; }
        this.PD = PathDirection.center;
        this.LastStep = null;
        this.mapUnitBorder = new MapUnitBorder();
        this.X = x;
        this.Y = y;
        this.PD = pd;
    }
    return PathStep;
}());
var PathDirection;
(function (PathDirection) {
    PathDirection[PathDirection["center"] = -1] = "center";
    PathDirection[PathDirection["top"] = 0] = "top";
    PathDirection[PathDirection["right"] = 1] = "right";
    PathDirection[PathDirection["bottom"] = 2] = "bottom";
    PathDirection[PathDirection["left"] = 3] = "left";
})(PathDirection || (PathDirection = {}));
var MapMain = /** @class */ (function () {
    function MapMain(sizex, sizey) {
        this.SizeX = 50;
        this.SizeY = 50;
        //所有路径
        this.ALLPath = [];
        //所有路径数组
        this.AllPathArray = [];
        //空格子
        this.EmptyUnits = [];
        this.times = 0;
        this.steps = 0;
        this.SizeX = sizex;
        this.SizeY = sizey;
    }
    //生成主方法(先生成主路的算法，可能导致生成失败，或者生成时间过长，已经弃用，使用InitMap2替代)
    // public InitMap(startX: number, startY: number, endX: number, endY: number): Array<PathStep> {
    // 	//清空
    // 	this.ALLPath = [];
    // 	//生成主路
    // 	this.MainPath = this.randomPath(startX, startY, endX, endY);
    // 	//用于缓存所有可用路径
    // 	this.ALLPath = this.MainPath.slice(0);
    // 	//生成岔路
    // 	this.forkpath();
    // 	return this.ALLPath;
    // }
    //生成主方法(全随机路算法，配合广度遍历生成答案路线)
    MapMain.prototype.InitMap2 = function (startX, startY, endX, endY) {
        //清空
        this.ALLPath = [];
        //生成随机岔路
        this.forkpath();
        //生成数组
        this.AllPathArray = this.getAllPathArray();
        //生成结果
        try {
            this.MainPath = this.findShortPath(startX, startY, endX, endY);
            this.steps = this.MainPath.length;
        }
        catch (_c) {
        }
        return this.ALLPath;
    };
    //生成随机路线(会尝试n次直到成功,用于生成主路，有比较大缺陷，已弃用)
    // private randomPath(startX: number, startY: number, endX: number, endY: number): Array<PathStep> {
    // 	this.times = 1;
    // 	this.steps = 0;
    // 	let pss: Array<PathStep> = [];
    // 	let isdeadend: Boolean = false;
    // 	let issuccess: Boolean = false;
    // 	//记录当前坐标
    // 	let stepx: number = startX;
    // 	let stepy: number = startY;
    // 	pss.push(new PathStep(startX, startY, PathDirection.center));
    // 	while (!issuccess) {
    // 		if (isdeadend == true) {
    // 			pss = [];
    // 			pss.push(new PathStep(startX, startY, PathDirection.center));
    // 			stepx = startX;
    // 			stepy = startY;
    // 			isdeadend = false;
    // 			this.steps = 0;
    // 			this.times = this.times + 1;
    // 			if (this.times > 10000) {
    // 				return null;
    // 			}
    // 		}
    // 		let PDs: Array<PathDirection> = [PathDirection.top, PathDirection.right, PathDirection.bottom, PathDirection.left];
    // 		if (this.tryPerStep(stepx, stepy, PDs, pss)) {
    // 			this.steps = this.steps + 1;
    // 			var laststep = pss[pss.length - 1];
    // 			stepx = laststep.X;
    // 			stepy = laststep.Y;
    // 			if (laststep.X == endX && laststep.Y == endY) {
    // 				issuccess = true;
    // 			}
    // 		}
    // 		else {
    // 			isdeadend = true;
    // 		}
    // 	}
    // 	return pss;
    // }
    //生成随机路线(只有开始没有目标,自身自灭,直到无路可走)
    MapMain.prototype.randomPath2 = function (startX, startY) {
        var pss = [];
        var isdeadend = false;
        //记录当前坐标
        var stepx = startX;
        var stepy = startY;
        pss.push(new PathStep(startX, startY, PathDirection.center));
        while (!isdeadend) {
            var PDs = [PathDirection.top, PathDirection.right, PathDirection.bottom, PathDirection.left];
            if (this.tryPerStep(stepx, stepy, PDs, pss)) {
                var laststep = pss[pss.length - 1];
                stepx = laststep.X;
                stepy = laststep.Y;
            }
            else {
                isdeadend = true;
            }
        }
        if (pss.length > 1) {
            return pss;
        }
        else {
            return null;
        }
    };
    //生成随机岔路直到所有空点被使用
    MapMain.prototype.forkpath = function () {
        //获取空
        while (this.getEmptyUnit().length > 0) {
            var empt = this.EmptyUnits[Math.floor(Math.random() * this.EmptyUnits.length)];
            if (this.ALLPath.length == 0) {
                this.ALLPath.push(new PathStep(1, 1));
            }
            var tmpAllPath = this.ALLPath.slice(0);
            //随机寻找能和空链接的点
            var linked = false;
            while (!linked) {
                //尝试在已有路径中选一个点
                var radPathIndex = Math.floor(Math.random() * tmpAllPath.length);
                var inpath = tmpAllPath[radPathIndex];
                //var linktype = this.checkLink(empt,inpath);
                var newfork = this.randomPath2(inpath.X, inpath.Y); //, empt.X, empt.Y);
                if (newfork != null) {
                    //去掉第一个;
                    newfork.shift();
                    //拆墙
                    switch (newfork[0].PD) {
                        case PathDirection.top:
                            this.ALLPath.filter(function (x) { return x.X == tmpAllPath[radPathIndex].X && x.Y == tmpAllPath[radPathIndex].Y; })[0].mapUnitBorder.top = false;
                            newfork[0].mapUnitBorder.bottom = false;
                            break;
                        case PathDirection.right:
                            this.ALLPath.filter(function (x) { return x.X == tmpAllPath[radPathIndex].X && x.Y == tmpAllPath[radPathIndex].Y; })[0].mapUnitBorder.right = false;
                            newfork[0].mapUnitBorder.left = false;
                            break;
                        case PathDirection.bottom:
                            this.ALLPath.filter(function (x) { return x.X == tmpAllPath[radPathIndex].X && x.Y == tmpAllPath[radPathIndex].Y; })[0].mapUnitBorder.bottom = false;
                            newfork[0].mapUnitBorder.top = false;
                            break;
                        case PathDirection.left:
                            this.ALLPath.filter(function (x) { return x.X == tmpAllPath[radPathIndex].X && x.Y == tmpAllPath[radPathIndex].Y; })[0].mapUnitBorder.left = false;
                            newfork[0].mapUnitBorder.right = false;
                            break;
                    }
                    this.ALLPath = this.ALLPath.concat(newfork);
                    linked = true;
                    //return newfork;
                }
                else {
                    //如果失败将再选取一个不重复的值
                    tmpAllPath.splice(radPathIndex, 1);
                }
            }
        }
        return this.ALLPath;
    };
    //尝试走一步 ，随机上下左右直到成功或者无路可走
    MapMain.prototype.tryPerStep = function (x, y, lstPD, pss) {
        if (lstPD.length == 0) {
            return false;
        }
        var p = lstPD[Math.floor(Math.random() * lstPD.length)]; //random.Next(lstPD.Count)
        var newx = x;
        var newy = y;
        switch (p) {
            case PathDirection.top:
                newy = y - 1;
                break;
            case PathDirection.right:
                newx = x + 1;
                break;
            case PathDirection.bottom:
                newy = y + 1;
                break;
            case PathDirection.left:
                newx = x - 1;
                break;
        }
        if (newx <= 0 || newy <= 0 || newx > this.SizeX || newy > this.SizeY
            || this.isExistsPathStep(pss, newx, newy)) {
            lstPD.splice(lstPD.indexOf(p), 1);
            return this.tryPerStep(x, y, lstPD, pss);
        }
        else {
            //拆了上一个格子的墙
            var newp = new PathStep(newx, newy, p);
            switch (p) {
                case PathDirection.top:
                    pss[pss.length - 1].mapUnitBorder.top = false;
                    newp.mapUnitBorder.bottom = false;
                    break;
                case PathDirection.right:
                    pss[pss.length - 1].mapUnitBorder.right = false;
                    newp.mapUnitBorder.left = false;
                    break;
                case PathDirection.bottom:
                    pss[pss.length - 1].mapUnitBorder.bottom = false;
                    newp.mapUnitBorder.top = false;
                    break;
                case PathDirection.left:
                    pss[pss.length - 1].mapUnitBorder.left = false;
                    newp.mapUnitBorder.right = false;
                    break;
            }
            pss.push(newp);
            return true;
        }
    };
    //判断是否已经存在路径
    MapMain.prototype.isExistsPathStep = function (pss, x, y) {
        for (var _i = 0, _c = this.ALLPath; _i < _c.length; _i++) {
            var a = _c[_i];
            if (a.X == x && a.Y == y) {
                return true;
            }
        }
        for (var _d = 0, pss_1 = pss; _d < pss_1.length; _d++) {
            var a = pss_1[_d];
            if (a.X == x && a.Y == y) {
                return true;
            }
        }
        return false;
    };
    //获取未编辑的格子
    MapMain.prototype.getEmptyUnit = function () {
        this.EmptyUnits = [];
        for (var i = 1; i <= this.SizeX; i++) {
            for (var j = 1; j <= this.SizeY; j++) {
                if (!this.isExistsPathStep(this.ALLPath, i, j)) {
                    this.EmptyUnits.push(new PathStep(i, j, PathDirection.center));
                }
            }
        }
        return this.EmptyUnits;
    };
    //将AllPath生成二维数组
    MapMain.prototype.getAllPathArray = function () {
        var AllPathArray = [];
        for (var i = 0; i < this.SizeX; i++) {
            var tmps = [];
            for (var j = 0; j < this.SizeY; j++) {
                tmps.push(null);
            }
            AllPathArray.push(tmps);
        }
        this.ALLPath.forEach(function (element) {
            AllPathArray[element.X - 1][element.Y - 1] = element;
        });
        return AllPathArray;
    };
    //广度遍历(寻路逻辑)
    MapMain.prototype.findShortPath = function (startX, startY, endX, endY) {
        //let AllPathArray = this.AllPathArray;
        var closePathArray = [];
        for (var i = 0; i < this.SizeX; i++) {
            var tmps = [];
            for (var j = 0; j < this.SizeY; j++) {
                tmps.push(null);
            }
            closePathArray.push(tmps);
        }
        var openPathArray = [this.AllPathArray[startX - 1][startY - 1]];
        var isEnd = false;
        var endstep = null;
        while (openPathArray.length > 0 && !isEnd) {
            var tmpp = openPathArray.shift();
            closePathArray[tmpp.X - 1][tmpp.Y - 1] = tmpp;
            if (tmpp.mapUnitBorder.top == false) {
                var tmpx = tmpp.X - 1;
                var tmpy = tmpp.Y - 2;
                if (tmpx >= 0 && tmpx < this.SizeX && tmpy >= 0 && tmpy < this.SizeY && closePathArray[tmpx][tmpy] == null) {
                    tmpp.PD = PathDirection.top;
                    this.AllPathArray[tmpx][tmpy].LastStep = tmpp;
                    if (tmpx == (endX - 1) && tmpy == (endY - 1)) {
                        isEnd = true;
                        endstep = this.AllPathArray[tmpx][tmpy];
                    }
                    else {
                        openPathArray.push(this.AllPathArray[tmpx][tmpy]);
                    }
                }
            }
            if (tmpp.mapUnitBorder.right == false) {
                var tmpx = tmpp.X;
                var tmpy = tmpp.Y - 1;
                if (tmpx >= 0 && tmpx < this.SizeX && tmpy >= 0 && tmpy < this.SizeY && closePathArray[tmpx][tmpy] == null) {
                    tmpp.PD = PathDirection.right;
                    this.AllPathArray[tmpx][tmpy].LastStep = tmpp;
                    if (tmpx == (endX - 1) && tmpy == (endY - 1)) {
                        isEnd = true;
                        endstep = this.AllPathArray[tmpx][tmpy];
                    }
                    else {
                        openPathArray.push(this.AllPathArray[tmpx][tmpy]);
                    }
                }
            }
            if (tmpp.mapUnitBorder.bottom == false) {
                var tmpx = tmpp.X - 1;
                var tmpy = tmpp.Y;
                if (tmpx >= 0 && tmpx < this.SizeX && tmpy >= 0 && tmpy < this.SizeY && closePathArray[tmpx][tmpy] == null) {
                    tmpp.PD = PathDirection.bottom;
                    this.AllPathArray[tmpx][tmpy].LastStep = tmpp;
                    if (tmpx == (endX - 1) && tmpy == (endY - 1)) {
                        isEnd = true;
                        endstep = this.AllPathArray[tmpx][tmpy];
                    }
                    else {
                        openPathArray.push(this.AllPathArray[tmpx][tmpy]);
                    }
                }
            }
            if (tmpp.mapUnitBorder.left == false) {
                var tmpx = tmpp.X - 2;
                var tmpy = tmpp.Y - 1;
                if (tmpx >= 0 && tmpx < this.SizeX && tmpy >= 0 && tmpy < this.SizeY && closePathArray[tmpx][tmpy] == null) {
                    tmpp.PD = PathDirection.left;
                    this.AllPathArray[tmpx][tmpy].LastStep = tmpp;
                    if (tmpx == (endX - 1) && tmpy == (endY - 1)) {
                        isEnd = true;
                        endstep = this.AllPathArray[tmpx][tmpy];
                    }
                    else {
                        openPathArray.push(this.AllPathArray[tmpx][tmpy]);
                    }
                }
            }
        }
        if (isEnd) {
            var result = [endstep];
            while (endstep.LastStep != null) {
                result.push(endstep.LastStep);
                endstep = endstep.LastStep;
            }
            return result;
        }
        else {
            return null;
        }
    };
    return MapMain;
}());
//下面是连连看的逻辑没有卵用
// //判断两个点能否链接成功(借鉴练练看的逻辑)
// private checkLink(a: PathStep, b: PathStep): number {
// 	if (a.X == b.X && this.horizon(a, b)) {
// 		return 1;
// 	}
// 	else if (a.Y == b.Y && this.vertical(a, b)) {
// 		return 2;
// 	}
// 	else if (this.oneCorner(a, b)) {
// 		return 3;
// 	}
// 	else if (this.twoCorner(a, b)) {
// 		return 4 ;
// 	}
// 	else{
// 		return 0;
// 	}
// }
// private horizon(a: PathStep, b: PathStep): boolean {
// 	var col_start = a.Y < b.Y ? a.Y : b.Y;        //获取a,b中较小的y值
// 	var col_end = a.Y < b.Y ? b.Y : a.Y;          //获取a,b中较大的值
// 	//遍历a,b之间是否通路，如果一个不是就返回false;
// 	for (var i = col_start + 1; i < col_end; i++) {
// 		if (this.isExistsPathStep([], a.X, i)) {
// 			return false;
// 		}
// 	}
// 	return true;
// }
// private vertical(a: PathStep, b: PathStep): boolean {
// 	var row_start = a.X < b.X ? a.X : b.X;
// 	var row_end = a.X < b.X ? b.X : a.X;
// 	for (var i = row_start + 1; i < row_end; i++) {
// 		if (this.isExistsPathStep([], i, a.Y)) {
// 			return false;
// 		}
// 	}
// 	return true;
// }
// private oneCorner(a: PathStep, b: PathStep): boolean {
// 	let c: PathStep = new PathStep(b.X, a.Y, PathDirection.center);
// 	let d: PathStep = new PathStep(a.X, b.Y, PathDirection.center);
// 	//判断C点是否有元素                
// 	if (!this.isExistsPathStep([], c.X, c.Y)) {
// 		var path1 = this.horizon(b, c) && this.vertical(a, c);
// 		return path1;
// 	}
// 	//判断D点是否有元素
// 	if (!this.isExistsPathStep([], d.X, d.Y)) {
// 		var path2 = this.horizon(a, d) && this.vertical(b, d);
// 		return path2;
// 	}
// 	else {
// 		return false;
// 	}
// }
// private twoCorner(a: PathStep, b: PathStep): boolean  {
// 	let ll: Array<Line> = this.scan(a, b);
// 	if (ll.length == 0)  {
// 		return false;
// 	}
// 	for (var i = 0; i < ll.length; i++)  {
// 		let tmpLine: Line = ll[i];
// 		if (tmpLine.direct == 1)  {
// 			if (this.vertical(a, tmpLine.a) && this.vertical(b, tmpLine.b))  {
// 				return true;
// 			}
// 		}
// 		else if (tmpLine.direct == 0)  {
// 			if (this.horizon(a, tmpLine.a) && this.horizon(b, tmpLine.b))  {
// 				return true;
// 			}
// 		}
// 	}
// 	return false;
// }
// private scan(a: PathStep, b: PathStep): Array<Line>  {
// 	let linkList: Array<Line> = new Array<Line>();
// 	//检测a点,b点的左侧是否能够垂直直连
// 	for (var i = a.Y; i >= 1; i--)  {
// 		if (!this.isExistsPathStep([], a.X, i) && !this.isExistsPathStep([], b.X, i) && this.vertical(new PathStep(a.X, i), new PathStep(b.X, i)))  {
// 			linkList.push(new Line(new PathStep(a.X, i), new PathStep(b.X, i), 0));
// 		}
// 	}
// 	//检测a点,b点的右侧是否能够垂直直连
// 	for (var i = a.Y; i < this.SizeX; i++)  {
// 		if (!this.isExistsPathStep([], a.X, i) && !this.isExistsPathStep([], b.X, i) && this.vertical(new PathStep(a.X, i), new PathStep(b.X, i)))  {
// 			linkList.push(new Line(new PathStep(a.X, i), new PathStep(b.X, i), 0));
// 		}
// 	}
// 	//检测a点,b点的上侧是否能够水平直连
// 	for (var j = a.X; j >= 1; j--)  {
// 		if (!this.isExistsPathStep([], j, a.Y) && !this.isExistsPathStep([], j, b.Y) && this.horizon(new PathStep(j, a.Y), new PathStep(j, b.Y)))  {
// 			linkList.push(new Line(new PathStep(j, a.Y), new PathStep(j, b.Y), 1));
// 		}
// 	}
// 	//检测a点,b点的下侧是否能够水平直连
// 	for (var j = a.X; j < this.SizeY; j++)  {
// 		if (!this.isExistsPathStep([], j, a.Y) && !this.isExistsPathStep([], j, a.Y) && this.horizon(new PathStep(j, a.Y), new PathStep(j, b.Y)))  {
// 			linkList.push(new Line(new PathStep(j, a.Y), new PathStep(j, b.Y), 1));
// 		}
// 	}
// 	return linkList;
// }
//# sourceMappingURL=Map.js.map
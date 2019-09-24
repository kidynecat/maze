var Unit = /** @class */ (function () {
    function Unit() {
        this.Type = 0;
        this.LocationX = 0;
        this.LocationY = 0;
        this.sp = null;
        this.sp = new Laya.Sprite();
    }
    return Unit;
}());
var UnitType;
(function (UnitType) {
    UnitType[UnitType["unkonw"] = 0] = "unkonw";
    UnitType[UnitType["player"] = 1] = "player";
})(UnitType || (UnitType = {}));
//# sourceMappingURL=Unit.js.map
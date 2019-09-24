class Unit{
    public Type:UnitType = 0;
    public LocationX:number = 0;
    public LocationY:number = 0;
    public sp:Laya.Sprite =null;
    constructor(){
        this.sp = new Laya.Sprite();
    }
}

enum UnitType{
    unkonw = 0,
    player = 1

}
const _HELPR_ ={
    fn:{
        _getMSG(){
            return "esto es un mensaje";
        }
    },
    method:{
        _print(){
            console.log(this._getMSG());
        }
    }
    
}

_HELPR_.method._print();
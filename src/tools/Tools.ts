import _ from "lodash";

export default class Tools{
    static randBool(){
        return  Math.random() < 0.5;
    }

    static randomArrayMember(arr:any[]){
        return _.sample(arr);
    }

    static randomNumber(min:number,max:number){
        return min + Math.floor(Math.random() * (max - min));
    }
}
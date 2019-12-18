import React, {Component} from 'react';
import './field.css';
import Square from "./square/square";


export default class Field extends Component {
    state = {
        numGrid: []
    };

    createTable(array,item) {
        for(let i=0;i<100;i++){
            array.push(item)
        }
        return array
    }
    createImgField(array){
        return array.map((el)=>
            <img className={'img'} src={require(`./img/${el}.png`)} alt=""/>)
    }

    render() {

        const {numGrid} = this.state;

        const grid = this.createTable(numGrid,'grid');

        const a = this.createImgField(grid) ;
        return (
            <div className={'field'}>
              <Square  />
            </div>

        )
    }
}

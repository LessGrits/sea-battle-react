import React, {Component} from 'react'

export default class Square extends Component {



    render(){
        return(
            <img className={'img'} src={require(`./img/grid.png`)} alt=""/>
        )
    }
}

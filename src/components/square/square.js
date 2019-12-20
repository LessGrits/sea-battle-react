import React, {Component} from 'react'

export default class Square extends Component {



    render() {
        const {type, setDot} = this.props;

        return (
            <img onClick={  setDot/*this.props.setDot*/} className={'img'} src={require(`../../img/${type}.png`)} alt=""/>)

    }
}



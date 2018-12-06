import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import numiActions from './duck/numi/actions';

import './styles/App.sass';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expression: '',
            result: ''
        };

        this.handleExp = this.handleExp.bind(this);

    }

    handleExp(expression){
        const { countExpression } = this.props;
        countExpression(expression);
    }


    handleKeyUp(event, type){
        const newState = {};
        let expression = event.target.value;
        newState[type] = expression;
        this.setState(newState);
        this.handleExp(expression);
    }

    async reloadInformation(){
        if(!localStorage.getItem("fixerData")){
            //fetching data from Fixer
            const fetchingUrl = process.env.REACT_APP_FIXER_URL+"?access_key=" +process.env.REACT_APP_ACCESS_KEY;
            const response = await fetch(fetchingUrl);
            const result = await response.json();

            //put in local storage
            let fixerData = [];
            fixerData.push(result.rates);
            localStorage.setItem("fixerData", JSON.stringify(fixerData));
        }
    }

    render() {
        const { numi } = this.props;
        return (
            <div className="numi">
                <textarea className="numi-expression" onChange={(e) => this.handleKeyUp(e, 'expression')}></textarea>
                <textarea className="numi-result" value={numi.result}></textarea>
                <button className="numi-reload" onClick={this.reloadInformation}>Reload</button>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {numi: state.calculator};
};

const mapDispatchToProps = dispatch => bindActionCreators({
    countExpression: numiActions.countExp,

}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
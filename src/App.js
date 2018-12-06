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

    saveExp(event){
        const code = event.keyCode;
        console.log(event, code);
        if(code == 13) { //Enter keycode
            console.log("ENTER KEY");
            const { saveExpression } = this.props;
            saveExpression();
        }
    }

    handleExp(expression){
        const { countExpression } = this.props;
        countExpression(expression);
    }


    handleKeyUp(event, type){
        const newState = {};
        let expression = event.target.value;
        let lines = expression.split('\n');    // lines is an array of all lines in textarea
        console.log(lines);
        newState[type] = lines[lines.length -1];
        this.setState(newState);
        this.handleExp(lines[lines.length -1]);
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
        console.log(numi);
        return (
            <div className="numi">
                <textarea className="numi-expression" onChange={(e) => this.handleKeyUp(e, 'expression')} onKeyDown={(e) => this.saveExp(e)}></textarea>
                <textarea className="numi-result" value={numi.result.join('\n')}></textarea>
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
    saveExpression: numiActions.saveExp,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
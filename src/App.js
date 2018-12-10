import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import numiActions from './duck/numi/actions';

import './styles/App.sass';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: '',
            expressions: [],
        };

        this.handleExp = this.handleExp.bind(this);
    }

    saveExp(event) {
        const code = event.keyCode;
        if (code === 13) {
            const { saveExpression } = this.props;
            saveExpression();
        }
    }

    countTotal(differenceIndex) {
        const { countTotal } = this.props;
        countTotal(differenceIndex);
    }

    handleExp(expression, differenceIndex, variableIndex) {
        const { countExpression } = this.props;
        countExpression(expression, differenceIndex, variableIndex);
    }

    countDifference(event) {
        let expression = event.target.value;
        let lines = expression.split('\n'); // lines is an array of all lines in textarea
        let differenceIndex = [];
        console.log("lines", lines, " in state ",  this.state.expressions);
        //get index of changed line
        this.state.expressions.filter((exp, ind) => {
            if (lines[ind] !== exp) {
                console.log(differenceIndex);
                differenceIndex.push(ind);
                return true;
            }
        });
        differenceIndex = differenceIndex[0];
        console.log(differenceIndex);
        console.log(lines, this.state.expressions, differenceIndex);
        this.setState({ expressions: lines });
        let currentLine = lines[differenceIndex];
        let deleted = false;
        if(this.state.expressions.length > lines.length) deleted = true;
        return { currentLine, differenceIndex, deleted };
    }

    handleChange(event) {
        const { createVar, deleteExpression } = this.props;
        const { currentLine, differenceIndex , deleted} = this.countDifference(event);
        console.log(currentLine, differenceIndex , deleted);
        if (deleted){
            deleteExpression(differenceIndex);
        }
        else if (currentLine) {
            if (currentLine.toLowerCase() === 'total')
                this.countTotal(differenceIndex);
            else if (currentLine.indexOf(':') !== -1) {
                // if it is assigning variable
                let variableIndex = currentLine.indexOf(':');
                this.handleExp(currentLine, differenceIndex, variableIndex);
                createVar(currentLine.slice(0, variableIndex), differenceIndex);
            } else this.handleExp(currentLine, differenceIndex);
        }

    }

    async reloadInformation() {
        if (!localStorage.getItem('fixerData')) {
            //fetching data from Fixer
            const fetchingUrl =
                process.env.REACT_APP_FIXER_URL +
                '?access_key=' +
                process.env.REACT_APP_ACCESS_KEY;
            const response = await fetch(fetchingUrl);
            const result = await response.json();

            //put in local storage
            let fixerData = [];
            fixerData.push(result.rates);
            localStorage.setItem('fixerData', JSON.stringify(fixerData));
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log("NEXT STATE", nextState, "this state: ", this.state)
        return true;
    }

    render() {
        const { numi } = this.props;
        return (
            <div className="numi">
                <textarea
                    className="numi-expression"
                    onKeyUp={e => this.saveExp(e)}
                    onChange={e => this.handleChange(e)}
                />
                <textarea
                    className="numi-result"
                    readOnly={true}
                    value={numi.result.join('\n')}
                />
                <button
                    className="numi-reload"
                    onClick={this.reloadInformation}
                >
                    Reload Fixer
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return { numi: state.calculator };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            deleteExpression: numiActions.deleteExp,
            countExpression: numiActions.countExp,
            saveExpression: numiActions.saveExp,
            countTotal: numiActions.countTotal,
            createVar: numiActions.createVar,
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

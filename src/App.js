import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import numiActions from './duck/numi/actions'

import './styles/App.sass'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expression: '',
            result: '',
        };

        this.handleExp = this.handleExp.bind(this)
    }

    saveExp(event) {
        const code = event.keyCode;
        if (code === 13) {
            const { saveExpression } = this.props;
            saveExpression()
        }
    }

    countTotal() {
        const { countTotal } = this.props;
        countTotal()
    }

    handleExp(expression) {
        const { countExpression } = this.props;
        countExpression(expression)
    }

    handleKeyUp(event, type) {
        const newState = {};
        const { createVar } = this.props;
        let expression = event.target.value;
        let lines = expression.split('\n'); // lines is an array of all lines in textarea
        let currentLine = lines[lines.length - 1];
        newState[type] = currentLine;
        this.setState(newState);
        if (currentLine.toLowerCase() === 'total') this.countTotal();
        else if (currentLine.indexOf(':') !== -1) {
            let variableIndex = currentLine.indexOf(':');
            this.handleExp(currentLine.slice(variableIndex+1));
            createVar(currentLine.slice(0, variableIndex))
        } else this.handleExp(currentLine)
    }

    async reloadInformation() {
        if (!localStorage.getItem('fixerData')) {
            //fetching data from Fixer
            const fetchingUrl = process.env.REACT_APP_FIXER_URL + '?access_key=' + process.env.REACT_APP_ACCESS_KEY;
            const response = await fetch(fetchingUrl);
            const result = await response.json();

            //put in local storage
            let fixerData = [];
            fixerData.push(result.rates);
            localStorage.setItem('fixerData', JSON.stringify(fixerData))
        }
    }

    render() {
        const { numi } = this.props;
        return (
            <div className="numi">
                <textarea
                    className="numi-expression"
                    onChange={e => this.handleKeyUp(e, 'expression')}
                    onKeyDown={e => this.saveExp(e)}
                />
                <textarea
                    className="numi-result"
                    value={numi.result.join('\n')}
                />
                <button
                    className="numi-reload"
                    onClick={this.reloadInformation}
                >
                    Reload Fixer
                </button>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { numi: state.calculator }
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
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
)(App)

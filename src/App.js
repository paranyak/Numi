import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import numiActions from './duck/numi';
import { numiOperations } from './duck/numi';
import { NEW_LINE, TOTAL } from './constants';

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
        if (code === NEW_LINE) {
            const { saveExpression } = this.props;
            saveExpression();
        }
    }

    countTotal(differenceIndex) {
        const { countTotal } = this.props;
        countTotal(differenceIndex);
    }

    handleExp({ expression, differenceIndex, variableIndex }) {
        const { countExpression } = this.props;
        countExpression({ expression, differenceIndex, variableIndex });
    }

    countDifference(event) {
        let expression = event.target.value;
        let lines = expression.split('\n');
        let differenceIndex = [];
        if (this.state.expressions.length > lines.length) {
            this.state.expressions.filter((exp, ind) => {
                if (lines[ind] !== exp) {
                    differenceIndex.push(ind);
                    return true;
                }
            });
        } else {
            lines.filter((exp, ind) => {
                if (this.state.expressions[ind] !== exp) {
                    differenceIndex.push(ind);
                    return true;
                }
            });
        }

        this.setState({ expressions: lines });
        let currentLines = [];
        for (let i = 0; i < differenceIndex.length; i++) {
            if (differenceIndex[i] < lines.length)
                currentLines.push(lines[differenceIndex[i]]);
        }

        let deleted = false;
        let changesLines = this.state.expressions.length - lines.length;
        if (changesLines >= 1)
            return {
                currentLines,
                differenceIndex,
                deleted: true,
                changesLines,
            };
        return {
            currentLines,
            differenceIndex,
            deleted,
            changesLines,
        };
    }

    handleChange(event) {
        const { createVar, deleteExpression } = this.props;
        const {
            currentLines,
            differenceIndex,
            deleted,
            changesLines,
        } = this.countDifference(event);
        if (deleted) {
            for (let i = changesLines - 1; i >= 0; i--) {
                deleteExpression(differenceIndex[i]);
            }
        }
        if (currentLines) {
            for (let i = 0; i < currentLines.length; i++) {
                if (currentLines[i].toLowerCase() === TOTAL)
                    this.countTotal(differenceIndex[i]);
                else if (currentLines[i].indexOf(':') !== -1) {
                    // if it is assigning variable
                    let variableIndex = currentLines[i].indexOf(':');
                    this.handleExp({
                        expression: currentLines[i],
                        differenceIndex: differenceIndex[i],
                        variableIndex,
                    });
                    createVar(
                        currentLines[i].slice(0, variableIndex),
                        differenceIndex[i]
                    );
                } else
                    this.handleExp({
                        expression: currentLines[i],
                        differenceIndex: differenceIndex[i],
                    });
            }
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
            countExpression: numiOperations.handleExpressionOperation,
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

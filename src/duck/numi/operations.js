import * as R from 'ramda';

import numiActions from './actions';

const handleExpressionOperation = ({
    expression,
    differenceIndex,
    variableIndex,
}) => (dispatch, getState) => {
    const { calculator } = getState();
    if (variableIndex) expression = expression.slice(variableIndex + 1);
    if(differenceIndex)expression = expression.replace('prev', calculator.result[differenceIndex-1]);
    console.log("exp", expression);
    if(expression.indexOf("in" !== -1))expression = cssConvert(expression, calculator.cssCovert);
    console.log("exp", expression);
    const expressionResult = R.compose(
        countExpression,
        getLocalOperators(calculator.localOperators),
        getLocalVariables(calculator.localVars),
        getDataFromFixer
    )(expression);
    dispatch(numiActions.countExp(expressionResult, differenceIndex));
};

const cssConvert = (expression, cssConvertions) => {
    let splittedExp = expression.split(" ");
    let separatingInd = splittedExp.indexOf("in");
    if(separatingInd !== -1 && separatingInd !== 0 && separatingInd !== splittedExp.length-1){
        splittedExp[separatingInd-1] = "/" + cssConvertions[splittedExp[separatingInd-1]];
        splittedExp[separatingInd] = "*";
        splittedExp[separatingInd+1] = cssConvertions[splittedExp[separatingInd+1]];
    }
    return splittedExp.join(" ");

};

const getDataFromFixer = expression => {
    if (localStorage.getItem('fixerData')) {
        const storedData = JSON.parse(localStorage.getItem('fixerData'))[0];
        const variables = Object.keys(storedData).join('|');
        expression = expression
            .toUpperCase()
            .replace(new RegExp(variables, 'g'), key => '*' + storedData[key]);
    }
    return expression;
};

const getLocalVariables = localVars => expression => {
    const localVariables = Object.keys(localVars).join('|');
    if (localVariables) {
        expression = expression
            .toLowerCase()
            .replace(new RegExp(localVariables, 'g'), key => localVars[key]);
    }
    return expression;
};

const getLocalOperators = localOperators => expression => {
    console.log("local ope: ", expression);
    const localValues = Object.values(localOperators);
    localValues.map((operatorArray, i) => {
        operatorArray.map(operator => {
            if (expression.toLowerCase().indexOf(operator) !== -1) {
                expression = expression
                    .toLowerCase()
                    .replace(operator, Object.keys(localOperators)[i]);
            }
        });
    });
    console.log("local ope: ", expression);

    return expression;
};

const countExpression = expression => {
    let result = '';
    let error = false;
    try {
        result = expression ? eval(expression) : '';
    } catch (e) {
        error = true;
    }
    return { result, error, expression };
};

export { handleExpressionOperation };

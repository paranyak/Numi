import numiActions from './actions';

const handleExpressionOperation = ({
    expression,
    differenceIndex,
    variableIndex,
}) => (dispatch, getState) => {
    const { calculator } = getState();
    if (variableIndex) expression = expression.slice(variableIndex + 1);
    expression = getDataFromFixer(expression);
    expression = getLocalVariables(expression, calculator.localVars);
    expression = getLocalOperators(expression, calculator.localOperators);
    let expressionResult = countExpression(expression);
    dispatch(numiActions.countExp(expressionResult, differenceIndex));

    //try to make compose

    // const example = compose(
    //     getLocalOperators,
    //     getLocalVariables,
    //     getDataFromFixer
    // )(expression, calculator.localVars , calculator.localOperators) ;
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

const getLocalVariables = (expression, localVars) => {
    const localVariables = Object.keys(localVars).join('|');
    if (localVariables) {
        expression = expression
            .toLowerCase()
            .replace(new RegExp(localVariables, 'g'), key => localVars[key]);
    }
    return expression;
};

const getLocalOperators = (expression, localOperators) => {
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

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import numiActions from './duck/numi/actions';

class App extends Component {
    constructor(props) {
        super(props);
        this.state={
            expression: '',
            result: '',
            timer: 0
        };

        this.handleExp = this.handleExp.bind(this);

    }

    handleExp(){
        console.log("EXPRESSION START", this.state.timer);
        const { expression } = this.state;
        const { countExpression } = this.props;
        countExpression(expression);
    }


    handleKeyUp(event, type){
        let { timer }  = this.state;
        clearTimeout(timer);
        timer=setTimeout(this.handleExp,500);

        const newState = {};
        newState[type] = event.target.value;
        newState['timer'] = timer;
        this.setState(newState);
    }

    render() {
        const { numi } = this.props;
        console.log("NUMI RENDER: ", numi);
        return (
            <div className="numi">
                <textarea className="numi-expression" onChange={(e) => this.handleKeyUp(e, 'expression')}></textarea>
                <textarea className="numi-result" value={numi.result}></textarea>
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
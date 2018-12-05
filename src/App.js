import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import numiActions from './duck/numi/actions';

class App extends Component {
    // constructor(props) {
    //     super(props);
    // }

    handleExp(e){
        console.log("HERE", numiActions);
        e.preventDefault();
        const { countExpression } = this.props;
        console.log("EXP", countExpression);
        countExpression("5+7");

    }

    render() {

        return (
            <div className="numi">
                <textarea className="numi-expression"></textarea>
                <textarea className="numi-result"></textarea>
                <input type="submit" value="count" onClick={(e) => this.handleExp(e)}/>
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
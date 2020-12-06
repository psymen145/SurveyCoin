import React from 'react';
import { MDBRow, MDBCol } from 'mdbreact';
import { connect } from 'react-redux';

import SYCAbi from '../abis/SurveyCoin.json';

class SurveyList extends React.Component {
    state = {
        surveys: []
    }

    async componentDidMount() {
        if (this.props.sycToken) {
            let result = await this.props.sycToken.methods.getAllSurveyTitlesByOwner(this.props.account).call();
            this.setState({
                surveys: result
            })
        } else {
            this.props.history.push("/");
        }
    }

    renderSurveys() {
        return this.state.surveys.map((survey, index) => {
            return (
                <div className="card mt-3" key={index}>
                    <div className="card-body">
                        <div className="card-title">{survey.toString()}</div>
                    </div>
                </div>
            )
        });
    }

    render() {
        return (
            <>
                <MDBRow>
                    <MDBCol className="mt-3">
                        <h5>Account: {this.props.account}</h5>
                    </MDBCol>
                </MDBRow>
                <MDBRow>
                    <MDBCol>
                        {this.renderSurveys()}
                    </MDBCol>
                </MDBRow>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return { account : state.account,
        netId : state.ethNetId,
        sycToken: state.sycToken,
    }
}

export default connect(
    mapStateToProps
)(SurveyList);
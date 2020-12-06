import React from 'react';
import { MDBRow, MDBCol } from 'mdbreact';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setNumSurvey, setAccountBalance } from '../actions';

class SurveyCreate extends React.Component {
    state = {
        title: "",
        loading: false
    }

    renderCreateBtn() {
        if (this.state.loading) {
            return (
                <button type="submit" className="btn btn-primary">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </button>
            )
        } else {
            return (
                <button type="submit" className="btn btn-primary">
                    Create
                </button>
            )
        }
    }

    renderAccountInfo() {
        return (
            <div className="card mb-3">
                <div className="card-body">
                    <div className="mb-3">
                        <b>Account Number:
                            {this.props.account ? this.props.account: ""} </b>
                    </div>
                    <div className="mb-3">
                        <b>SYC Balance: {this.props.balance ? this.props.balance.toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0"} </b>
                    </div>
                    <div>
                        <b>Number of Survey(s): {this.props.numSurvey ? this.props.numSurvey.toString()
                                            .replace(/\B<(?=(\d{3})+(?!\d))/g, ",") : "0"} </b>
                    </div>
                </div>
            </div>
        )
    }

    renderBurnNotification() {
        if (this.props.numSurvey >= 5) {
            return (
                <div className="text-danger mb-3">
                    <b>Account has more than 5 surveys, creating a survey will burn a SurveyCoin</b>
                </div>
            )
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        if (this.state.title) {
            e.target.elements.surveyName.classList.remove("is-invalid");
            let web3 = window.web3;
            if (this.props.sycToken) {
                this.setState({ loading: true});

                // to do : need to check if survey was properly created
                await this.props.sycToken.methods.createSurvey(this.state.title).send({from : this.props.account});

                // if successfully created
                let surveyNum = await this.props.sycToken.methods.getOwnerSurveyCount(this.props.account).call();
                let bal = await this.props.sycToken.methods.balanceOf(this.props.account).call();
                this.props.setNumSurvey(surveyNum);
                this.props.setAccountBalance(bal);

                // to do: feedback for successful creation or failure

                // clear title after finishing
                this.setState({ 
                    loading: false,
                    title: ""
                });

            } else {
                this.props.history.push("/");
            }
        } else {
            e.target.elements.surveyName.classList.add("is-invalid");
        }
    }

    render() {
        return (
            <>
                <MDBRow className="my-3">
                    <MDBCol>
                        <h4><b>Create a Survey</b></h4>
                    </MDBCol>
                </MDBRow>
                <MDBRow>
                    <MDBCol>
                        {this.renderAccountInfo()}
                        {this.renderBurnNotification()}
                    </MDBCol>
                </MDBRow>
                <MDBRow>
                    <MDBCol sm="12">
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label>Survey Title</label>
                                <input type="text"
                                    className="form-control"
                                    name="surveyName"
                                    value={this.state.title}
                                    onChange={e => {this.setState({title: e.target.value})}}
                                />
                            </div>
                            {this.renderCreateBtn()}
                        </form>
                    </MDBCol>
                </MDBRow>
            </>
        );
    }
}

const mapStateToProps = state => {
    return { account : state.account,
        netId : state.ethNetId,
        sycToken: state.sycToken,
        balance: state.acctBal,
        numSurvey: state.numSurvey
    }
}

export default connect(
    mapStateToProps,
    { setNumSurvey, setAccountBalance }
) (withRouter(SurveyCreate));
import React from 'react';
import abiDecoder from 'abi-decoder';
import { MDBRow, MDBCol } from 'mdbreact';
import Web3 from 'web3';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import SYCAbi from '../abis/SurveyCoin.json';
import { setEthNetId, setAccount, setAccountBalance, setSycToken, setNumSurvey, setAbiDecoder } from '../actions';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sycBalance: 0
        }
    }

    async loadWeb3() {
        if(window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            alert("Non ethereum-based browser detected");
        }
    }

    async loadBlockChainData() {
        const web3 = window.web3;
        const networkId = await web3.eth.net.getId();
        const sycNetworkData = SYCAbi.networks[networkId];
        const sycToken = new web3.eth.Contract(SYCAbi.abi, sycNetworkData.address);
        const accounts = await web3.eth.getAccounts();

        let sycBal = await sycToken.methods.balanceOf(accounts[0]).call();
        let numSurvey = await sycToken.methods.getOwnerSurveyCount(accounts[0]).call();

        this.props.setAccount(accounts[0]);
        this.props.setAccountBalance(sycBal);
        this.props.setEthNetId(networkId);
        this.props.setSycToken(sycToken);
        this.props.setNumSurvey(numSurvey);
    }
    
    async componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockChainData();
    }
    
    renderCreateButton() {
        return (
            <Link className="btn btn-primary"
                to="/survey/new">Create Survey</Link>
        )
    }

    renderAccountInfo() {
        return (
            <div className="card mt-3">
                <div className="card-body">
                    <div className="mb-3">
                        <b>Account Number: {this.props.account} </b>
                    </div>
                    <div className="mb-3">
                        <b>SYC Balance: {this.props.balance.toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </b>
                    </div>
                    <div>
                        <b>Number of Survey(s): {this.props.numSurvey.toString()
                                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</b>
                    </div>
                </div>
            </div>
        )
    }

    renderShowSurveyButton() {
        return (
            <Link className="btn btn-info"
                to="/survey/"> Show Surveys</Link>
        )
    }

    render() {
        return (
            <MDBRow>
                <MDBCol sm="12">
                    {this.renderAccountInfo()}
                </MDBCol>
                <MDBCol sm="3">
                    {this.renderCreateButton()}
                </MDBCol>
                <MDBCol sm="3">
                    {this.renderShowSurveyButton()}
                </MDBCol>
            </MDBRow>
        )
    }
}

const mapStateToProps = state => {
    return {
        account: state.account, 
        balance: state.acctBal,
        sycToken: state.sycToken,
        numSurvey: state.numSurvey
    };
}

export default connect(
    mapStateToProps,
    { setEthNetId, setAccount, setAccountBalance, setSycToken, setNumSurvey, setAbiDecoder }
)(Home);
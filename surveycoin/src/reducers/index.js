import { combineReducers } from 'redux';

const ethNetReducer = (ethNetId = null, action) => {
    if (action.type === 'ETH_NET') {
        return action.payload;
    }
    return ethNetId;
}

const accountReducer = (acct = null, action) => {
    if (action.type === 'SET_ACCT') {
        return action.payload;
    }
    return acct;
}

const accountBalanceReducer = (bal = 0, action) => {
    if (action.type === 'SET_BAL') {
        return action.payload;
    }
    return bal;
}

const sycTokenReducer = (token = null, action) => {
    if (action.type === 'SET_SYC_TOKEN') {
        return action.payload;
    }
    return token;
}

const numSurveyReducer = (numSurvey = 0, action) => {
    if (action.type === "SET_SURVEY_NUM") {
        return action.payload;
    }
    return numSurvey;
}

const abiDecoderReducer = (decoder = null, action) => {
    if (action.type === "SET_ABI_DECODER") {
        return action.payload;
    }
    return decoder;
}

export default combineReducers({
    ethNetId: ethNetReducer,
    account: accountReducer,
    acctBal: accountBalanceReducer,
    sycToken: sycTokenReducer,
    numSurvey: numSurveyReducer,
    abiDecoder: abiDecoderReducer
});
export const setEthNetId = ethNetId => {
    return {
        type: 'ETH_NET',
        payload: ethNetId 
    }
};

export const setAccount = acctNum => {
    return {
        type: 'SET_ACCT',
        payload: acctNum
    }
}

export const setAccountBalance = bal => {
    return {
        type: 'SET_BAL',
        payload: bal
    }
}

export const setSycToken = token => {
    return {
        type: 'SET_SYC_TOKEN',
        payload: token
    }
}

export const setNumSurvey = numSurvey => {
    return {
        type: 'SET_SURVEY_NUM',
        payload: numSurvey
    }
}

export const setAbiDecoder = decoder => {
    return {
        type: 'SET_ABI_DECODER',
        payload: decoder
    }
}
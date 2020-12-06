import React from 'react';
import Web3 from 'web3';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

import Header from './Header';
import SurveyCreate from './SurveyCreate';
import SurveyList from './SurveyList';
import Home from './Home';

class App extends React.Component {
    render() {
        return (
            <>
                <BrowserRouter>
                    <Header/>
                    <div className="container">
                        <Route path="/" exact component={Home} />
                        <Route path="/survey/new" exact component={SurveyCreate} />
                        <Route path="/survey/" exact component={SurveyList} />
                    </div>
                </BrowserRouter>
            </>
        )
    }
}

export default App;
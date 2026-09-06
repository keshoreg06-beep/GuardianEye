import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import { Layout } from '../components/layout';

const App: React.FC = () => {
    return (
        <Router>
            <Layout>
                <Switch>
                    <Route path="/" exact component={HomePage} />
                    {/* Add more routes here as needed */}
                </Switch>
            </Layout>
        </Router>
    );
};

export default App;
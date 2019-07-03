import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import Start from '../Start/Start';
import Results from '../Results/Results';
import Checkin from '../Checkin/Checkin';
import Admin from '../Admin/Admin';

function App() {
    return (
        <Router>
            <Link to='/results'>GO TO 99999</Link>

            <Route exact path='/' component={Start} />
            <Route path='/results' component={Results} />
            <Route path='/checkin' component={Checkin} />
            <Route path='/admin' component={Admin} />
        </Router>
    );
}

export default App;
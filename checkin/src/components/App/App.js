import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import Start from '../Start/Start';
import Results from '../Results/Results';
import Checkin from '../Checkin/Checkin';
import Setpin from '../Setpin/Setpin';
import Admin from '../Admin/Admin';
import Missing from '../Missing/Missing';

function App() {
    return (
        <Router>
            <div id='nav'>
                <Link className='navLink' to='/'>SHHA Check-In System</Link>
                <Link className='navLink' to='/admin'>Admin</Link>
            </div>

            <div id='view'>
                <Switch>
                    <Route exact path='/' component={Start} />
                    <Route path='/results' component={Results} />
                    <Route path='/checkin' component={Checkin} />
                    <Route path='/setpin' component={Setpin} />
                    <Route path='/admin' component={() => <Admin masterPass={'2222'} />} />
                    <Route exact path='*' component={Missing} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import Start from '../Start/Start';
import Results from '../Results/Results';
import Checkin from '../Checkin/Checkin';
import Admin from '../Admin/Admin';
import Missing from '../Missing/Missing';

class App extends React.Component {
    render() {
        return (
            <Router>
                <div id='nav'>
                    <Link className='navLink' to='/'>SHHA Check-In System</Link>
                    <div id='links'>
                        <a class='navLink' href='/admin/logout'>Logout</a>
                    </div>
                </div>

                <div id='view'>
                    <Switch>
                        <Route exact path='/' component={Start} />
                        <Route path='/results' component={Results} />
                        <Route path='/checkin' component={Checkin} />
                        <Route path='/admin' component={Admin} />
                        <Route exact path='*' component={Missing} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
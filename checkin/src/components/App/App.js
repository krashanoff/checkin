import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import Start from '../Start/Start';
import Results from '../Results/Results';
import Checkin from '../Checkin/Checkin';
import Missing from '../Missing/Missing';

class App extends React.Component {    
    render() {
        return (
            <Router>
                <div id='nav'>
                    <Link className='navLink' to='/'>SHHA Check-In System</Link>
                    <a className='navLink' href='http://localhost:5000/api/login'>Admin</a>
                </div>

                <div id='view'>
                    <Switch>
                        <Route exact path='/' component={Start} />
                        <Route path='/results' component={Results} />
                        <Route path='/checkin' component={Checkin} />
                        <Route exact path='*' component={Missing} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
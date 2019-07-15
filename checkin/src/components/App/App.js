import React from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';
import Start from '../Start/Start';
import Results from '../Results/Results';
import Checkin from '../Checkin/Checkin';
import Missing from '../Missing/Missing';

class App extends React.Component {
    componentDidMount() {
        this.viewHeightCalc();
        document.addEventListener('resize', this.viewHeightCalc);
    }

    viewHeightCalc = () => {
        const navHeight = parseInt(window.getComputedStyle(document.getElementById('nav')).getPropertyValue('height'));
        console.log(navHeight);
        console.log(window.innerHeight);
        document.documentElement.style.setProperty('--viewHeight', (window.innerHeight - navHeight) + 'px');
        console.log(document.documentElement.style.getPropertyValue('--viewHeight'));
    }
    
    render() {
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
                        <Route exact path='*' component={Missing} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
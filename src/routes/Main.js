import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../containers/Home';
import WallRoute from './WallRoute';
import ArchiveRoute from './ArchiveRoute';
import Account from '../containers/Account';
import Login from '../containers/Login';
import Signup from '../containers/Signup';
import Auth from '../modules/Auth';
import { Redirect } from 'react-router';

const Main = () => (
	<main>
		<Switch>
			<Route exact path='/' component={Home} />
			<Route exact path='/account' render={() => (
				!Auth.isUserAuthenticated() ? (
					<Redirect to='/login'/>
				) : (
					<Account />
				)
			)} />
			<Route exact path='/login' component={Login} />
			<Route exact path='/signup' component={Signup} />
			<Route path='/walls' component={WallRoute} />
			<Route path='/archive' component={ArchiveRoute} />
		</Switch>
	</main>
);

export default Main;
import React from 'react';
import Auth from '../modules/Auth';

function checkAuth() {

	function logout(e) {
		//remove authentication token
		Auth.deauthenticateUser();
	}

	//check if the user has already been authenticated
	if (Auth.isUserAuthenticated()) {
		return (
			<ul className="nav">
				<li><a href="/">Home</a></li>
				<li><a href="/account">My Account</a></li>
				<li><a href="/walls">Wall List</a></li>
				<li><a href="/" onClick={logout}>Logout</a></li>
			</ul>
		);
	} else {
		return (
			<ul className="nav">
				<li><a href="/">Home</a></li>
				<li><a href="/walls">Wall List</a></li>
				<li><a href="/login">Login</a></li>
				<li><a href="/signup">Sign Up</a></li>
			</ul>
		);
	}
}

const Nav = ({children}) => (
		<nav>
			{checkAuth()}
		</nav>
);

export default Nav;
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
			<div className="nav-text">
				<ul className="nav">
					<li className="logo"><a href="/">Piton</a></li>
					<li className="nav-link"><a href="/" onClick={logout}>Logout</a></li>
					<li className="nav-link"><a href="/walls">Wall List</a></li>
					<li className="nav-link"><a href="/account">My Account</a></li>
				</ul>
			</div>
		);
	} else {
		return (
			<div className="nav-text">
				<ul className="nav">
					<li className="logo"><a href="/">Piton</a></li>
					<li className="nav-link"><a href="/signup">Sign Up</a></li>
					<li className="nav-link"><a href="/login">Login</a></li>
					<li className="nav-link"><a href="/walls">Wall List</a></li>
				</ul>
			</div>
		);
	}
}

const Nav = ({children}) => (
		<nav>
			{checkAuth()}
		</nav>
);

export default Nav;
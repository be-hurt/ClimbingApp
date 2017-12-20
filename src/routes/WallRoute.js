import React from 'react';
import { Switch, Route } from 'react-router-dom';
import List from '../containers/List';
import WallDetail from '../containers/WallDetail';
import WallSubmit from '../containers/WallSubmit';

//WallRoute matches one of two different routes depending on the full pathname
//Will redirect the user according to whether they are looking at the full list of walls or a wall's specific page
const WallRoute = () => (
	<Switch>
		<Route exact path='/walls' component={List} />
		<Route exact path='/walls/submit' component={WallSubmit} />
		<Route exact path='/walls/:wall_id' component={WallDetail} />
	</Switch>
);

export default WallRoute;
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ArchiveList from '../containers/ArchiveList';
import Archive from '../containers/Archive';

//WallRoute matches one of two different routes depending on the full pathname
//Will redirect the user according to whether they are looking at the full list of walls or a wall's specific page
const WallRoute = () => (
	<Switch>
		<Route exact path='/archive' component={ArchiveList} />
		<Route exact path='/archive/:wall_id' component={Archive} />
	</Switch>
);

export default WallRoute;
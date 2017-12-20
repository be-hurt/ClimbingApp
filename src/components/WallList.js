import React, { Component } from 'react';
import Wall from './Wall';

class WallList extends Component {
	render() {
		let wallNodes = this.props.data.map(wall => {
			return (
				<Wall 
					name={ wall.name } key={ wall._id } id={ wall._id } 
					image={ wall.image } difficulty={ wall.difficulty } 
					rating={ wall.rating } date={ wall.date }
				>
					{ wall.description }
				</Wall>
			)
		})
		return (
			<div>
				{ wallNodes }
			</div>
		)
	}
}

export default WallList;
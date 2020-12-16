import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';

import { HomePage, MenuPage, DashboardPage } from './pages';

function App() {
	return (
		<Switch>
			<Route path='/' exact={true} component={HomePage} />
			<Route path='/menu' exact={true} component={MenuPage} />
			<Route path='/dashboard' exact={true} component={DashboardPage} />
		</Switch>
	);
}

export default App;
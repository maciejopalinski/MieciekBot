import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';

import { HomePage, MenuPage, DashboardPage, NotFound } from './pages';

function App() {
	return (
		<Switch>
			<Route path='/' exact={true} component={HomePage} />
			<Route path='/menu' exact={true} component={MenuPage} />
			<Route path='/dashboard' exact={true} component={DashboardPage} />
			<Route component={NotFound} />
		</Switch>
	);
}

export default App;
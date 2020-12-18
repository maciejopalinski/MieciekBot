import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { API } from './util/api';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HomePage, MenuPage, DashboardPage, NotFound } from './pages';

function App() {
	return (
		<Switch>
			<Route path='/' exact={true} component={HomePage} />
			<Route path='/menu' exact={true} component={MenuPage} />
			<Route path='/dashboard/:id' exact={true} component={DashboardPage} />
			
			<Route path='/@me' exact={true} component={() => {
				window.location.href = API('/discord/@me');
			}} />
			
			<Route component={NotFound} />
		</Switch>
	);
}

export default App;
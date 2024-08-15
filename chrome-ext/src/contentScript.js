import { Calendar, ConfigProvider, Flex } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

const App = () => {

	const cellRender = (date) => {
		return (
			<Flex
				style={{
					width: '100%',
					aspectRatio: '1/1',
					background: '#f0f0f0',
					justifyContent: 'center',
					alignItems: 'center',
					borderTop: '1px solid blue',
					margin: '4px'
				}}
			>
				{date.date()}
			</Flex>
		);
	};

	const [user, setUser] = React.useState(null);

	React.useEffect(() => {
		chrome.storage.local.get(['uuid', 'login'], function(result) {
			if (result.uuid && result.login)
				setUser(result);
		});
		return () => {
			setUser(null);
		};
	}, []);

	const getLocations = async () => {

		const response = await fetch('https://translate.intra.42.fr/users/bwisniew/locations_stats.json', {
			credentials: 'include',
		})

		if (response.status !== 200) {
			console.log('Error while fetching locations');
			return;
		}

		const data = await response.json();
		console.log(data);

	}

	React.useEffect(() => {
		if (!user)
			return;
		getLocations();
		
	}, [user]);

	const disabledDate = (date) => {
		return date && date > moment().endOf('day');
	  };


	return (
	<ConfigProvider
		theme={{
			components: {
				Calendar: {
					itemActiveBg: 'transparent',
				},
			},
		}}
	>
		<div
			style={{
				width: '100%',
				backgroundColor: 'white',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				marginTop: '5vh',
				padding: '25px',
			}}
		>
			<Calendar
				style={{
					width: '100%',
					height: '100%',
				}}
				fullCellRender={cellRender}
				disabledDate={disabledDate}
			/>
		</div>
	</ConfigProvider>
	);
};

const locationElement = document.getElementById('locations');
const boxedElement = locationElement ? locationElement.closest('.boxed') : null;

let root = document.createElement('div');

if (boxedElement)
	boxedElement.parentNode.replaceChild(root, boxedElement);

if (root)
	ReactDOM.render(<App />, root);

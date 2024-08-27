import { ConfigProvider } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import { UserProvider } from './context/useUser';
import Calendar from './logtime/Calendar';


const App = () => {

	return (
	<ConfigProvider
		theme={{
			components: {
				Calendar: {
					itemActiveBg: 'transparent',
					fullPanelBg: 'transparent',
				},
			},
		}}
	>
	<UserProvider>
		<div
			style={{
				width: '100%',
				height: '100vh',
				backgroundColor: 'white',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				marginTop: '5vh',
				padding: '25px',
				overflow: 'hidden',
				flexDirection: 'column',
				position: 'relative',
			}}
		>
			<Calendar />
		</div>
	</UserProvider>
	</ConfigProvider>
	);
};

const locationElement = document.getElementById('locations');
const boxedElement = locationElement ? locationElement.closest('.boxed') : null;

let root = document.createElement('div');

if (boxedElement)
{
	chrome.storage.local.get(['uuid', 'login'], function(result) {
		if (result.uuid && result.login)
		{
			boxedElement.parentNode.replaceChild(root, boxedElement);
			ReactDOM.render(<App />, root);
		}
	});
}


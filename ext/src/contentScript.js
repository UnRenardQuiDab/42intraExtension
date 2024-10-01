import { ConfigProvider } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import { UserProvider } from './context/useUser';
import Calendar from './logtime/Calendar';

const browserAPI = process.env.BROWSER === 'firefox' ? browser : chrome;

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
				height: '415px',
				backgroundColor: 'white',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				marginTop: '40px',
				padding: '25px',
				overflow: 'hidden',
				flexDirection: 'column',
				position: 'relative',
				border: '1px solid #f7f7f7',
				borderRadius: '3px',
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


const container = document.querySelectorAll('.container-inner-item');
if (container)
	container.forEach((element) => {
		element.style.marginLeft = '0'
	});


let root = document.createElement('div');

if (boxedElement)
	{
		browserAPI.storage.local.get(['token', 'login'], function(result) {
		if (result.token && result.login)
			{
				boxedElement.parentNode.replaceChild(root, boxedElement);
				ReactDOM.render(<App />, root);
			}
		});
	}
	

import { ConfigProvider, Select, Tooltip } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import { UserProvider } from './context/useUser';
import Calendar from './logtime/Calendar';
import { WarningOutlined } from '@ant-design/icons';
import './logtime/Calendar.css';

const browserAPI = process.env.BROWSER === 'firefox' ? browser : chrome;

const App = () => {

	return (
	<ConfigProvider
		theme={{
			components: {
				Calendar: {
					itemActiveBg: 'transparent',
					fullPanelBg: 'transparent',
					fullBg: 'var(--container-background-color, white)',
				},
			},
			
		}}
	>
	<UserProvider>
		<div
			style={{
				width: '100%',
				height: '415px',
				backgroundColor: 'var(--container-background-color, white)',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				marginTop: '40px',
				padding: '25px',
				overflow: 'hidden',
				flexDirection: 'column',
				position: 'relative',
				border: '1px solid var(--general-border-color, #f7f7f7)',
				borderRadius: '3px',
				color: 'var(--text-color)',
			}}
		>
			<Calendar />
		</div>
	</UserProvider>
	</ConfigProvider>
	);
};


const WarningTooltip = () => {

	return(
		<Tooltip title="Your 42IntraTools session has expired">
			<WarningOutlined style={{
				marginLeft: '8px',
			}} />
		</Tooltip>
	)
};

const locationElement = document.getElementById('locations');
const boxedElement = locationElement ? locationElement.closest('.boxed') : null;

let root = document.createElement('div');

if (boxedElement)
	{
		const container = document.querySelectorAll('.container-inner-item');
		if (container)
			container.forEach((element) => {
				element.style.marginLeft = '0'
			});
		browserAPI.storage.local.get(['token', 'login', 'maxAge'], function(result) {
		if (result.token && result.login && new Date(parseInt(result.maxAge)) > Date.now())
		{
			boxedElement.parentNode.replaceChild(root, boxedElement);
			ReactDOM.render(<App />, root);
		}
		else if (result.login && new Date(parseInt(result.maxAge)) <= Date.now()){
			const title = document.querySelectorAll('.profile-title')[0];
			title.style.justifyContent = 'flex-start';
			title.appendChild(root)
			ReactDOM.render(<WarningTooltip />, root);
		}
		});
	}
	

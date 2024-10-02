import React from 'react';
import ReactDOM from 'react-dom';
import {Button, Image, Typography} from 'antd';
import config from '../config';
const { Text } = Typography;
import { LogoutOutlined, ReloadOutlined } from '@ant-design/icons';

const App = () => {

	const [user, setUser] = React.useState(null);
	const [logoutLoading, setLogoutLoading] = React.useState(false);
	const browserAPI = process.env.BROWSER === 'firefox' ? browser : chrome;

	const onClick = async () => {
		browserAPI.tabs.create({
			url: `${config.api}/auth/42`,
			active: true
		});
	}

	
	const onLogout = async () => {
		setLogoutLoading(true);
		const response = await fetch(`${config.api}/auth/logout`, {
			headers: {
				'X-42IntraTools-Key': user?.token,
			},
			credentials: 'include',
		});
		if (response.ok)
		{
			setUser(null);
			browserAPI.storage.local.clear();
		}
		else
			console.error('Error while logging out');
		setLogoutLoading(false);
	}



	React.useEffect(() => {
		browserAPI.storage.local.get(['token', 'login', 'maxAge'], function(result) {
			if (result.login)
				setUser(result);
		});
		return () => {
			setUser(null);
		};
	}, []);

  return (
	<div
		style={{
			minWidth: '300px',
			minHeight: '200px',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'column'
		}}
	>
	  {!user && <Button
		onClick={onClick}
	  >
		Login with
		<Image
			height='100%'
			src='/icons/42logo.png'
			preview={false}
		/> intra
	  </Button>}

		{user && new Date(parseInt(user.maxAge)) > Date.now() &&
			<>
				<Text
					style={{
						margin: '16px'
					}}
				>
					Connected as {user.login}
				</Text>
				<Button
					onClick={onLogout}
					danger
					icon={<LogoutOutlined />}
					loading={logoutLoading}
					disabled={logoutLoading}
				>
					Logout
				</Button>
			</>
		}
		{user && new Date(parseInt(user.maxAge)) <= Date.now() &&
		<>
			<Text
				style={{
					margin: '16px'
				}}
			>
				Your session has expired
			</Text>
			<Button
				onClick={onClick}
				color="primary"
				variant="filled"
				icon={<ReloadOutlined />}
			>
				Refresh Token
			</Button>
		</>

		}
	</div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

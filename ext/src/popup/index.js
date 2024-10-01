import React from 'react';
import ReactDOM from 'react-dom';
import {Button, Image, Typography} from 'antd';
import config from '../config';
const { Text } = Typography;
import { LogoutOutlined, ReloadOutlined } from '@ant-design/icons';

const App = () => {

	const [user, setUser] = React.useState(null);
	const browserAPI = process.env.BROWSER === 'firefox' ? browser : chrome;

	const onClick = async () => {
		browserAPI.tabs.create({
			url: `${config.api}/auth/42`,
			active: true
		});
	}

	React.useEffect(() => {
		browserAPI.storage.local.get(['token', 'login', 'maxAge'], function(result) {
			if (result.login)
				setUser(result);
			console.log(result, new Date(parseInt(result.maxAge)), Date.now());
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
					onClick={() => {
						chrome.storage.local.clear();
						setUser(null);
					}}
					danger
					icon={<LogoutOutlined />}
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

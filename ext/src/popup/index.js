import React from 'react';
import ReactDOM from 'react-dom';
import {Button, Image, Typography} from 'antd';
import config from '../config';
const { Text } = Typography;
import { LogoutOutlined } from '@ant-design/icons';

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
		browserAPI.storage.local.get(['token', 'login'], function(result) {
			if (result.token && result.login)
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

	  {user &&
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
	</div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

import React from 'react';
import ReactDOM from 'react-dom';
import {Button, Typography} from 'antd';
import config from '../config';
const { Text } = Typography;

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
		browserAPI.storage.local.get(['uuid', 'login'], function(result) {
			if (result.uuid && result.login)
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
		Login with intra
	  </Button>}

	  {user &&
		<>
			<Text>
				Connected as {user.login}
			</Text>
			<Button
				onClick={() => {
					chrome.storage.local.clear();
					setUser(null);
				}}
				danger
			>
				Logout
			</Button>
		</>

	  }
	</div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

import config from "./config";

const browserAPI = process.env.BROWSER === 'firefox' ? browser : chrome;

chrome.webNavigation.onCompleted.addListener(function(details) {
	const url = new URL(details.url);
	const token = url.searchParams.get('token');
	const login = url.searchParams.get('login');

	if (token) {
		browserAPI.storage.local.set({ token, login }, function() {
		console.log('token saved:', token);
		chrome.tabs.remove(details.tabId);
	  });
	}
  }, {url: [{urlMatches: `${config.api}/auth/redirect`}]});



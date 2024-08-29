import config from "./config";

const browserAPI = process.env.BROWSER === 'firefox' ? browser : chrome;

chrome.webNavigation.onCompleted.addListener(function(details) {
	const url = new URL(details.url);
	const uuid = url.searchParams.get('uuid');
	const login = url.searchParams.get('login');

	if (uuid) {
		browserAPI.storage.local.set({ uuid, login }, function() {
		console.log('uuid saved:', uuid);
		chrome.tabs.remove(details.tabId);
	  });
	}
  }, {url: [{urlMatches: `${config.api}/auth/redirect`}]});



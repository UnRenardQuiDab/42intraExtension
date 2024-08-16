chrome.webNavigation.onCompleted.addListener(function(details) {
	const url = new URL(details.url);
	const uuid = url.searchParams.get('uuid');
	const login = url.searchParams.get('login');

	if (uuid) {
	  chrome.storage.local.set({ uuid, login }, function() {
		console.log('uuid saved:', uuid);
		chrome.tabs.remove(details.tabId);
	  });
	}
  }, {url: [{urlMatches: `http://localhost:3000/redirect`}]});


console.log('Background script loaded', `${chrome.identity.getRedirectURL()}token`);
import react from "react";

export default function useFetch(url, options = {}) {
  const [data, setData] = react.useState(null);
  const [loading, setLoading] = react.useState(true);
  const [error, setError] = react.useState(null);

  
  react.useEffect(() => {
	const fetchData = async (user) => {
	  try {
		const response = await fetch(url,
			{
				...options,
				headers: {
					'X-42IntraTools-Key': user.uuid,
					...options.headers
				},
				credentials: 'include',
			});
		const data = await response.json();
		setData(data);
	  } catch (error) {
		setError(error);
	  } finally {
		setLoading(false);
	  }
	};
	chrome.storage.local.get(['uuid', 'login'], function(result) {
		if (result.uuid && result.login){
			fetchData(result);
		}
	});
  }, []);

  return { data, loading, error };

}
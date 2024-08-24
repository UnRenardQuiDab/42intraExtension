import react from "react";
import useFetch from "./useFetch";
import config from "../config";

export default function useLogtime(login) {

	const [durations, setDurations] = react.useState({});
	const {data: defaultDurations, loading: defaultLoading} = useFetch(`https://translate.intra.42.fr/users/${login}/locations_stats.json`);
	const {data: apiDuration, loading: apiLoading} = useFetch(`${config.api}/user/${login}/logtime`);

	react.useEffect(() => {
		if (defaultDurations && apiDuration){
			setDurations({...defaultDurations, ...apiDuration});
		}
	}, [defaultDurations, apiDuration]);

	return {
		durations,
		from: apiDuration?.from,
		loading: defaultLoading || apiLoading
	};
}
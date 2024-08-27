import react from "react";
import useFetch from "./useFetch";
import config from "../config";
import dayjs from 'dayjs';

export default function useLogtime(login) {

	const [durations, setDurations] = react.useState({});
	const {data: defaultDurations, loading: defaultLoading} = useFetch(`https://translate.intra.42.fr/users/${login}/locations_stats.json`);
	const {data: apiDuration, loading: apiLoading} = useFetch(`${config.api}/user/${login}/logtime`);


	const durationAddition = (a, b) => {
		const [aHours, aMinutes, aSeconds] = a.split(':');
		const [bHours, bMinutes, bSeconds] = b.split(':');
		const totalSeconds = parseInt(aSeconds) + parseInt(bSeconds) + parseInt(aMinutes) * 60 + parseInt(bMinutes) * 60 + parseInt(aHours) * 3600 + parseInt(bHours) * 3600;
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;
		return `${hours}:${minutes}:${seconds}`;
	}

	react.useEffect(() => {
		if (defaultDurations && apiDuration){
			let newDurations = {...defaultDurations, ...apiDuration};
		
			for (const key in newDurations){
				if (key === 'from')
					continue;
				const date = dayjs(key);
				if (newDurations[date.format('YYYY-MM')])
					newDurations[date.format('YYYY-MM')] = durationAddition(newDurations[date.format('YYYY-MM')], newDurations[key]);
				else
					newDurations[date.format('YYYY-MM')] = newDurations[key];

				if (newDurations[date.format('YYYY')])
					newDurations[date.format('YYYY')] = durationAddition(newDurations[date.format('YYYY')], newDurations[key]);
				else
					newDurations[date.format('YYYY')] = newDurations[key];

				if (newDurations.total)
					newDurations.total = durationAddition(newDurations.total, newDurations[key]);
				else
					newDurations.total = newDurations[key];
			}
			setDurations(newDurations);
		}
	}, [defaultDurations, apiDuration]);

	return {
		durations,
		from: apiDuration?.from,
		loading: defaultLoading || apiLoading
	};
}
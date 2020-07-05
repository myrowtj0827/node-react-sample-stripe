
const getNextMonth = (current, delta) => {
	const num_days = new Date(current.getFullYear(), current.getMonth() + delta + 1, 0).getDate();
	return new Date(
		current.getFullYear(), current.getMonth() + delta, current.getDate() > num_days ? num_days : current.getDate(),
		current.getHours(), current.getMinutes(), current.getSeconds(), current.getMilliseconds());
};

export default getNextMonth;

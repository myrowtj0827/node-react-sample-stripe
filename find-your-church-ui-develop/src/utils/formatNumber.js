
const formatNumber = (num) => {
	return num.toString().length < 2 ? "0" + num : num;
};

export default formatNumber;

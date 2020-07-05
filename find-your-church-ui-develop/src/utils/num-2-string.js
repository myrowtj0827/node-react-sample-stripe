
const num2String = (val, len) => {
	let buf;
	let ret = '';

	for(let i = 0; i < len; i++){
		buf = (val >> i) & 1;
		if(buf === 1)
			ret = '1' + ret;
		else
			ret = '0' + ret;
	}

	return ret;
};

export default num2String;

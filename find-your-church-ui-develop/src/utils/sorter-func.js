
export const sorter_newest = (a, b) => {
	return b.data.activated_at - a.data.activated_at;
};

export const sorter_closest = (a, b) => {
	return a.dist - b.dist;
};

export const sorter_farthest = (a, b) => {
	return b.dist - a.dist;
};

export const sorter_name_asc = (a, b) => {
	const a_name = a.data.community_name.toLowerCase();
	const b_name = b.data.community_name.toLowerCase();
	if(a_name > b_name)
		return 1;
	else if(a_name < b_name)
		return -1;
	else
		return 0;
};

export const sorter_name_desc = (a, b) => {
	const a_name = a.data.community_name.toLowerCase();
	const b_name = b.data.community_name.toLowerCase();
	if(a_name > b_name)
		return -1;
	else if(a_name < b_name)
		return 1;
	else
		return 0;
};


export const community_config = {
	SOCIALS: [
		"Website", "Facebook", "Instagram", "Vimeo", "Youtube", "Twitter", "Podcast", "Zoom",
	],

	SOCIAL_PLACEHOLDERS: [
		/* Website */ "https://findyourchurch.org",
		/* Facebook */ "https://facebook.com/findyourchurch",
		/* Instagram */ "https://instagram.com/findyourchurch",
		/* Vimeo */ "https://vimeo.com/findyourchurch123",
		/* Youtube */ "https://youtube.com/findyourchurch",
		/* Twitter */ "https://twitter.com/findyourchurch",
		/* Podcast */ "https://spotify.com/findyourchurch",
		/* Zoom */ "https://zoom.com/8233451842",
	],

	/**
	 * must include at least 1 category.
	 */
	CATEGORIES: [
		"Churches", "Youth Groups", "Young Adult Groups", "Focus Groups", "Life Groups", "Support Groups", "Events", "Social Groups",
	],

	TOOL_TIPS: {
		"": "All Communities",
		"undefined": "All Communities",
		"Churches": "Churches offer weekly gatherings for anyone and everyone to come together, hear a message, and worship through music.",
		"Youth Groups": "Youth Groups are a faith based gathering for youth in Jr. and/or Sr. High.",
		"Young Adult Groups": "Young Adult Groups are a faith based gathering typically for young adults aged 18 - 29.",
		"Focus Groups": "Focus Groups foster stimulating discussion that focus on a common interest or topic such as a book club, bible study, alpha, prayer meetings, etc.",
		"Life Groups": "Life Groups are primarily social by nature and provide an opportunity to connect with others that may be in a similar season of life such as age, education, occupation, etc.",
		"Support Groups": "Support Groups are a faith based network of people sharing a common obstacle or life event.",
		"Events": "Events cover a wide variety of one-time and/or recurring occasions such as concerts, national conventions, community outreach, neighborhood bbq’s, worship night, etc.",
		"Social Groups": "Social Groups connect others with similar interests and are typically theme based such as rockclimbing, photography, video games, watch party’s, organized sports, etc.",
	},

	SEARCH_RADIUS: [
		1, 3, 5, 10, 20, 30,// 5000 are for testing
	],

	FILTERS: {
		days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		times: ["Morning", "Afternoon", "Evening"],
		frequency: ["Once", "Weekly", "Bi-Weekly", "Monthly", "Quarterly"],
		hosting: ["In-person", "Virtual"],
		ages: ["All", "Elementary", "Jr. High", "High School", "Young Adult", "20's", "30's", "40's", "50's", "60's", "Retired"],
		gender: ["Co-ed", "Men", "Women", "Couples"],
		kids_welcome: ["Yes", "No"],
		parking: ["Street", "Parking Lot", "Parking Ramp", "Handicap", "Drop-off / Pick-up Zone"],
		ministries: ["Sunday School", "Youth Groups", "Young Adults", "Small Groups", "Life Groups", "Support Groups", "Alpha"],
		other_services: ["Child Care", "First Communion", "Wedding Ceremony's", "Marriage Counseling", "Financial Consult", "Event / Space Rental"],
		average_attendance: 0,
		ambiance: ["Contemporary", "Traditional", "Both-Separate", "Both-Combined"],
		event_type: ["Social", "Worship", "Guest Speaker", "Concert", "Fundraiser", "Conference", "Community Outreach", "Recreational Sports"],
		support_type: ["Divorce", "Addiction", "Death / Grief", "LGBTQ", "Marriage"]
	},

	FILTERS4URL: {
		days: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
		times: ["morning", "afternoon", "evening"],
		frequency: ["once", "weekly", "bi_weekly", "monthly", "quarterly"],
		hosting: ["in_person_hosting", "virtual_hosting"],
		ages: ["all_ages", "elementary", "jr_high", "high_school", "young_adult", "20s", "30s", "40s", "50s", "60s", "retired"],
		gender: ["co_ed", "men", "women", "couples"],
		kids_welcome: ["yes_kids", "no_kids"],
		parking: ["street", "parking_lot", "parking_ramp", "handicap", "drop_off_pick_up_zone"],
		ministries: ["sunday_school", "youth_groups", "young_adults", "small_groups", "life_groups", "support_groups", "alpha"],
		other_services: ["child_care", "first_communion", "wedding_ceremony_s", "marriage_counseling", "financial_consult", "event_space_rental"],
		ambiance: ["contemporary", "traditional", "both_separate", "both_combined"],
		event_type: ["social", "worship", "guest_speaker", "concert", "fundraiser", "conference", "community_outreach", "recreational_sports"],
		support_type: ["divorce", "addiction", "death_grief", "lgbtq", "marriage"]
	},
};

export const INIT_FILTERS = {
	owner_id: '',
	owner_title: '',
	owner_contact: '',
	days: '0'.repeat(community_config.FILTERS.days.length),
	times: '0'.repeat(community_config.FILTERS.times.length),
	frequency: '0'.repeat(community_config.FILTERS.frequency.length),
	hosting: '0'.repeat(community_config.FILTERS.hosting.length),
	ages: '0'.repeat(community_config.FILTERS.ages.length),
	gender: '0'.repeat(community_config.FILTERS.gender.length),
	kids_welcome: '0'.repeat(community_config.FILTERS.kids_welcome.length),
	parking: '0'.repeat(community_config.FILTERS.parking.length),
	ministries: '0'.repeat(community_config.FILTERS.ministries.length),
	other_services: '0'.repeat(community_config.FILTERS.other_services.length),
	ambiance: '0'.repeat(community_config.FILTERS.ambiance.length),
	event_type: '0'.repeat(community_config.FILTERS.event_type.length),
	support_type: '0'.repeat(community_config.FILTERS.support_type.length),
};

export default community_config;

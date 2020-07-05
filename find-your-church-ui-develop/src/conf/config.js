
const app_config = {
	FYC_API_URL: process.env.REACT_APP_API_URL,

	US_PHONE_PATTERN: "[(]?[0-9]{2,3}[)-]?[ ]?[0-9]{3}[ -]?[0-9]{4}",
	MAX_PIC_SIZE: 3072, // in kBs, = 3MB
	MAX_PIC_COUNT: 6,
	MAX_TOTAL_SIZE: 16793599, // in Bytes, < 16793600 = 16MB

	/**
	 * Public key for Stripe payment.
	 */
	STRIPE_PK: process.env.REACT_APP_STRIPE_PK,

	/**
	 * for social login
	 */
	GOOGLE_CLIENT_ID: "123456789",
	FACEBOOK_APP_ID: "123456789",

	/**
	 * G-map
	 */
	GOOGLEMAP_API_KEY: process.env.REACT_APP_GOOGLEMAP_API_KEY,
};

export default app_config;


## Project structure

In the project directory, you can see:
```
+<project_root>
|-api - simple api server for authentication & data store
|-public - public html assets
+-src - main source tree root
  |-actions - redux actions
  |-components - react ui components
  |-img - images
  |-pages - react ui pages that include components
  |-reducers - redux reducers
  |-store - redux storage of states
  |-utils
    +-setAuthToken.js - auth token manager
  |-App.css - main app component's style sheet
  |-App.js - main app componenet with url routes
  |-auth-config.js - social auth IDs
  |-index.js - project start point
```

## Quick start

### `npm install`
This command must be run once when building the project the 1st.
### `set port=8000` // for the google login test
### `npm start`

And go to `http://localhost:8000`

### Configuration
Considerable materials are:
#### `/conf/config.js`
#### 	
    FYC_API_URL: "http://...",
    STRIPE_PK: "pk_test_...",
    GOOGLEMAP_API_KEY: "...",

#### `/conf/community-config.js`
    CATEGORIES: [
        "Churches", "Young Adult Groups", "Youth Groups",
    ],

    SEARCH_RADIUS: [
        1, 3, 5,
    ],

    FILTERS: {
        ...
    },

    SOCIALS: [
        "Website", "Facebook", "Instagram", "Vimeo", "Youtube", "Twitter", "Podcast", "Zoom",
    ]
#### For the production, some configurations must be replaced:
    FYC_API_URL,
    STRIPE_PK,
    GOOGLEMAP_API_KEY,
    CATEGORIES,
    ...

## Back-end API

### 1st of all, get changed a file:
``In a file: <project folder>/package.json``
```
...
"proxy": "http://127.0.0.1:5000",
...
```
This configuration is just for the running of back-end.
### Install mongodb on the server.

### Run the back-end api application:
```
> cd api
> npm install
> npm start
```

## Social authentication

For social (Google and Facebook) authentications, see a file: `<project folde>/src/auth-config.json`
```
{
  "GOOGLE_CLIENT_ID": "123456789",
  "FACEBOOK_APP_ID": "123456789"
}
```
Before testing, got to write valid IDs here.

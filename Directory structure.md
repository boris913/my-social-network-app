  Directory structure:
└── boris913-my-social-network-app/
    ├── Readme.md
    ├── Note.txt
    ├── backend/
    │   ├── README.md
    │   ├── index.js
    │   ├── jwt.js
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── .gitignore
    │   ├── node_modules/
    │   ├── src/
    │   │   ├── app.js
    │   │   ├── server.js
    │   │   ├── config/
    │   │   │   ├── config.json
    │   │   │   └── database.js
    │   │   ├── controllers/
    │   │   │   ├── authController.js
    │   │   │   ├── commentController.js
    │   │   │   ├── likeController.js
    │   │   │   ├── notificationController.js
    │   │   │   ├── retweetController.js
    │   │   │   ├── shareController.js
    │   │   │   ├── tweetController.js
    │   │   │   └── userController.js
    │   │   ├── middleware/
    │   │   │   ├── auth.js
    │   │   │   └── upload.js
    │   │   ├── models/
    │   │   │   ├── comment.js
    │   │   │   ├── follow.js
    │   │   │   ├── index.js
    │   │   │   ├── like.js
    │   │   │   ├── notification.js
    │   │   │   ├── privatemessage.js
    │   │   │   ├── retweet.js
    │   │   │   ├── share.js
    │   │   │   ├── tweet.js
    │   │   │   └── user.js
    │   │   └── routes/
    │   │       ├── auth.js
    │   │       ├── comment.js
    │   │       ├── like.js
    │   │       ├── notification.js
    │   │       ├── retweet.js
    │   │       ├── share.js
    │   │       ├── tweet.js
    │   │       └── user.js
    │   └── uploads/
    └── frontend/
        ├── README.md
        ├── README.old.md
        ├── package-lock.json
        ├── package.json
        ├── postcss.config.js
        ├── tailwind.config.js
        ├── .env
        ├── .gitignore
        ├── public/
        │   ├── index.html
        │   ├── manifest.json
        │   ├── robots.txt
        │   └── tweets.json
        └── src/
            ├── App.css
            ├── App.js
            ├── App.test.js
            ├── index.css
            ├── index.js
            ├── reportWebVitals.js
            ├── setupTests.js
            ├── components/
            │   ├── Feed.js
            │   ├── Modal.js
            │   ├── Navbar.js
            │   ├── NavbarTop.js
            │   ├── NewTweet.js
            │   ├── Notifications.js
            │   ├── SearchBar.js
            │   ├── Suggestions.js
            │   ├── Trends.js
            │   ├── Tweet.js
            │   ├── TweetButton.js
            │   └── VerifiedBadge.js
            ├── context/
            │   ├── AuthContext.js
            │   └── ThemeContext.js
            ├── css/
            │   └── Tweet.css
            ├── data/
            │   ├── suggestions.json
            │   └── trends.json
            ├── pages/
            │   ├── HomePage.js
            │   ├── LoginPage.js
            │   ├── NotFound.js
            │   ├── ProfilePage.js
            │   ├── RegisterPage.js
            │   └── TweetDetail.js
            └── services/
                └── api.js

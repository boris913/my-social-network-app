const { Tweet } = require('../models');

exports.createTweet = async (req, res) => {
  const { content, image_url, video_url } = req.body;
  try {
    const tweet = await Tweet.create({
      user_id: req.user.userId,
      content,
      image_url,
      video_url
    });
    res.status(201).json(tweet);
  } catch (error) {
    res.status(400).json({ error: 'Unable to create tweet' });
  }
};

exports.getTweets = async (req, res) => {
  try {
    const tweets = await Tweet.findAll();
    res.status(200).json(tweets);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch tweets' });
  }
};
# Sprout Social API Changelog

> Source: [https://api.sproutsocial.com/docs/changelog/](https://api.sproutsocial.com/docs/changelog/)

[Changelog](https://api.sproutsocial.com/docs/changelog/)

- [Version 1.0.0](https://api.sproutsocial.com/docs/changelog/#version-100)

[Sprout API](https://api.sproutsocial.com/docs/)

# Changelog

## [version 100 permalink](https://api.sproutsocial.com/docs/changelog/\#version-100) Version 1.0.0

#### [january 13 2026 permalink](https://api.sproutsocial.com/docs/changelog/\#january-13-2026) January 13, 2026

Added `network_metadata` field to customer profile metadata endpoints (`v1/{customerId}/metadata/customer` and `v2/{customerId}/metadata/customer`). This field provides network-specific metadata such as location data - `address` and `store_code`.

#### [december 5 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#december-5-2025) December 5, 2025

Updated `clickthrough_link` documentation - IG, YT, Threads, TikTok aren't supported. Clarified LinkedIn limitations.

#### [december 3 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#december-3-2025) December 3, 2025

Added notes about Facebook metric deprecations that occurred on November 15, 2025.

Added Bluesky to supported Listening networks.

#### [november 26 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#november-26-2025) November 26, 2025

Added documentation for the from.guid filtering option for messages endpoint.

#### [september 15 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#september-15-2025) September 15, 2025

Added support for the `lifetime.post_shares_count` metric for the following networks:

- Threads
- Facebook
- LinkedIn
- Instagram
- YouTube
- TikTok

#### [september 3 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#september-3-2025) September 3, 2025

Personal profiles and posts for LinkedIn are now supported for Analytics endpoints.

#### [august 29 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#august-29-2025) August 29, 2025

Added Tiktok to supported Listening networks.

#### [august 11 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#august-11-2025) August 11, 2025

Updated documentation to include Bluesky posts and post metrics.

#### [august 5 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#august-5-2025) August 5, 2025

Added `name` field to the customer metadata returned by the `v1/metadata/client` endpoint.

#### [july 23 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#july-23-2025) July 23, 2025

Added `email` field to the user metadata returned by `v1/{customerId}/metadata/customers/users` endpoint.
Updated documentation to include = `language_code` field for `messages` endpoint

#### [july 21 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#july-21-2025) July 21, 2025

Updated documentation to include the `document.theme_ids` filter for topic messages.

#### [july 14 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#july-14-2025) July 14, 2025

Updated documentation to include the `is_boosted` field for posts.

#### [june 23 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#june-23-2025) June 23, 2025

Removed references to Facebook Groups, which are deprecated.

#### [june 4 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#june-4-2025) June 4, 2025

Updated documentation and imagery for Public API access, including API token management, OAuth token generation, and EULA acceptance flow.

#### [may 30 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#may-30-2025) May 30, 2025

Updated documentation to include availability requirements for Public API metrics

#### [may 2 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#may-2-2025) May 2, 2025

Updated Facebook and Instagram profile metrics to include paid, organic, and total impressions.

#### [april 21 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#april-21-2025) April 21, 2025

Added `lifetime.views` for Instagram posts and `views` for Instagram profiles.

#### [march 14 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#march-14-2025) March 14, 2025

Added note on limitation for Publishing posts `delivery_state`

#### [february 19 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#february-19-2025) February 19, 2025

Documentation updates - changes to the Message Fields table:

- `case_id` field added for most message types

Added search by message ID to the `messages` endpoint.

#### [february 3 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#february-3-2025) February 3, 2025

Added the following metrics for Threads profiles.

- Followers By Age Gender `lifetime_snapshot.followers_by_age_gender`
- Followers By City `lifetime_snapshot.followers_by_city`
- Followers By Country `lifetime_snapshot.followers_by_country`
- Likes `likes`
- Profile Views `profile_views`
- Quotes `quotes_count`
- Replies `comments_count`
- Reposts `reposts_count`
- Shares `shares_count`

#### [january 24 2025 permalink](https://api.sproutsocial.com/docs/changelog/\#january-24-2025) January 24, 2025

The following Instagram profile metrics are deprecated and no longer available:

- Email Clicks `email_contacts`
- Get Directions Clicks `get_directions_clicks`
- Text Message Clicks `text_message_clicks`
- Website Clicks `website_clicks`
- Phone Call Clicks `phone_call_clicks`
- Profile Visitors `profile_views_unique`
- Profile Actions `profile_actions`

#### [september 16 2024 permalink](https://api.sproutsocial.com/docs/changelog/\#september-16-2024) September 16, 2024

The following Facebook metrics are no longer available in the Sprout Analytics API. This change was made necessary by the deprecation of these metrics from Meta's APIs.

**NOTE:** If you have Tableau workbooks utilizing these metrics, they will appear blank after this deprecation. You'll need to remove the deprecated metrics from the workbook to allow the visualizations to show.

Facebook: Owned Profile Metrics

- Negative Feedback `negative_feedback`
- Unique Negative Feedback `negative_feedback_unique`
- Place Checkins `place_checkins`
- Post Photo View Clicks `post_photo_view_clicks`
- Post Video Play Clicks `post_video_play_clicks`
- 10-Second Video Views `video_views_10s`
- Autoplay 10-Second Video Views `video_views_10s_autoplay`
- Video Views 10s Click To Play `video_views_10s_click_to_play`
- Organic 10-Second Video Views `video_views_10s_organic`
- Paid 10-Second Video Views `video_views_10s_paid`
- Replayed Video Views 10s Repeat `video_views_10s_repeat`
- Unique 10-Second Video Views `video_views_10s_unique`

Facebook: Post Metrics

- Negative Feedback `lifetime.negative_feedback`
- Unique Negative Feedback `lifetime.negative_feedback_unique`
- Unique Post Clicks `lifetime.post_content_clicks_unique`
- Unique Post Link Clicks `lifetime.post_link_clicks_unique`
- Unique Post Photo View Clicks `lifetime.post_photo_view_clicks_unique`
- Unique Post Video Play Clicks `lifetime.post_video_play_clicks_unique`
- 10-Second Video Views `lifetime.video_views_10s`
- Autoplay 10-Second Video Views `lifetime.video_views_10s_autoplay`
- Click to Play 10-Second Video Views `lifetime.video_views_10s_click_to_play`
- Organic 10-Second Video Views `lifetime.video_views_10s_organic`
- Paid 10-Second Video Views `lifetime.video_views_10s_paid`
- Video Views 10s Unique `lifetime.video_views_10s_unique`
- Sound off 10-Second Video Views `lifetime.video_views_10s_sound_off`
- Sound on 10-Second Video Views `lifetime.video_views_10s_sound_on`
- Unique 10-Second Video Views `lifetime.video_views_10s_unique`

#### [september 5 2024 permalink](https://api.sproutsocial.com/docs/changelog/\#september-5-2024) September 5, 2024

Added comment sentiment metrics for Instagram, Facebook, Threads, X, and YouTube posts.

- Positive Comments `lifetime.sentiment_comments_positive_count`
- Negative Comments `lifetime.sentiment_comments_negative_count`
- Neutral Comments `lifetime.sentiment_comments_neutral_count`
- Unclassified Comments `lifetime.sentiment_comments_unclassified_count`
- Net Sentiment Score `lifetime.net_sentiment_score`

#### [august 7 2024 permalink](https://api.sproutsocial.com/docs/changelog/\#august-7-2024) August 7, 2024

Removed references to Google Business Messages (GBM), which has been deprecated.

#### [july 25 2024 permalink](https://api.sproutsocial.com/docs/changelog/\#july-25-2024) July 25, 2024

Added `reels_unique_session_plays` metric for Facebook and Instagram Reels. This represents the number of times your reel starts
to play after an impression is already counted. This metric counts reels sessions with 1 millisecond or more of
playback. This metric excludes replays (i.e. looping back to rewatch the reel in the same session).

#### [july 22 2024 permalink](https://api.sproutsocial.com/docs/changelog/\#july-22-2024) July 22, 2024

Documentation site illustrates how to generate a user-scoped OAuth 2.0 access token.

#### [july 9 2024 permalink](https://api.sproutsocial.com/docs/changelog/\#july-9-2024) July 9, 2024

Documentation site uses automatically generated anchor links derived from markdown headers. Manually created anchors
made from HTML divs are removed.

#### [june 27 2024 permalink](https://api.sproutsocial.com/docs/changelog/\#june-27-2024) June 27, 2024

Post level video views and impressions metrics for Instagram and Facebook reels use total views for posts created after
January 1, 2024 rather than number of initial views.

#### [may 31 2024 permalink](https://api.sproutsocial.com/docs/changelog/\#may-31-2024) May 31, 2024

Added endpoints for creating/retrieving Publishing Posts and Media Upload

#### [march 7 2024 permalink](https://api.sproutsocial.com/docs/changelog/\#march-7-2024) March 7, 2024

The following Facebook metrics are no longer available in the Sprout Analytics API. This change was made necessary by the deprecation of these metrics from Meta's APIs.

**NOTE:** If you have Tableau workbooks utilizing these metrics, they will appear blank after this deprecation. You'll need to remove the deprecated metrics from the workbook to allow the visualizations to show.

Facebook: Owned Profile Metrics

- Followers By Country `lifetime_snapshot.followers_by_country`
- Followers By Age Gender `lifetime_snapshot.followers_by_age_gender`
- Followers By City `lifetime_snapshot.followers_by_city`
- Logged In Page Views `profile_views_login`
- Logged Out Page Views `profile_views_logout`
- Page Visitors `profile_views_login_unique`
- Mobile Place Check-ins `place_checkins_mobile`
- Page Content Activity `profile_content_activity`

Facebook: Post Metrics

- Fan Organic Impressions `lifetime.impressions_follower_organic`
- Fan Paid Impressions `lifetime.impressions_follower_paid`
- Non-fan Organic Impressions `lifetime.impressions_nonfollower_organic`
- Non-fan Paid Impressions `lifetime.impressions_nonfollower_paid`
- Fan Paid Reach `lifetime.impressions_follower_paid_unique`
- Users Talking About This `lifetime.post_activity_unique`
- Unique Reactions `lifetime.reactions_unique`
- Unique Comments `lifetime.comments_count_unique`
- Unique Shares `lifetime.shares_count_unique`
- Unique Answers `lifetime.question_answers_unique`

#### [december 21 2023 permalink](https://api.sproutsocial.com/docs/changelog/\#december-21-2023) December 21, 2023

Added support for Listening Topics. New endpoints to retrieve metrics and messages for Topics are now available. These new endpoints follow existing patterns and structures established across the analytics and metadata endpoints.

#### [november 6 2023 permalink](https://api.sproutsocial.com/docs/changelog/\#november-6-2023) November 6, 2023

Documentation updates - changes to the `YouTube` owned profile metrics:

- `posts_sent_count` added to the list of owned profile metrics available for YouTube profiles.

#### [september 25 2023 permalink](https://api.sproutsocial.com/docs/changelog/\#september-25-2023) September 25, 2023

Documentation updates - changes to the `tag` metadata endpoint:

- `type` field added to indicate the tag type: LABEL or CAMPAIGN

#### [september 19 2023 permalink](https://api.sproutsocial.com/docs/changelog/\#september-19-2023) September 19, 2023

Documentation updates - changes to the Customer Profile metadata endpoint:

- `external_name` for Pinterest profiles connected after June 6, 2023 now returns the Pinterest username.

#### [november 30 2022 permalink](https://api.sproutsocial.com/docs/changelog/\#november-30-2022) November 30, 2022

Added support for `inbox_permalink` within the `messages` endpoint.
This link navigates an authorized and logged-in Sprout user to the message thread for the message obtained via the API.

#### [november 2 2022 permalink](https://api.sproutsocial.com/docs/changelog/\#november-2-2022) November 2, 2022

Documentation updates - changes to the Message Fields table:

- `sent` field added for most message types
- `internal.from.*` fields added for Youtube message types

#### [september 13 2022 permalink](https://api.sproutsocial.com/docs/changelog/\#september-13-2022) September 13, 2022

Added support for `clickthrough_link` for `TWITTER` posts within the `analytics/posts` endpoint.

#### [august 26 2022 permalink](https://api.sproutsocial.com/docs/changelog/\#august-26-2022) August 26, 2022

Updated documentation to include the new Messages endpoint, which lives in a new endpoint collection.
Includes multiple other minor updates:

- added detail about request params for existing endpoints previously missing from the docs
- more explicit error messages when a request fails validation
- docs updated to include info on multiple new message/post types, including reviews networks, minor grammar fixes

#### [june 23 2022 permalink](https://api.sproutsocial.com/docs/changelog/\#june-23-2022) June 23, 2022

Updated language to differentiate more clearly between a Message and a sent Post.

#### [april 6 2021 permalink](https://api.sproutsocial.com/docs/changelog/\#april-6-2021) April 6, 2021

Clarified the fields available for each network for posts.

#### [december 16 2020 permalink](https://api.sproutsocial.com/docs/changelog/\#december-16-2020) December 16, 2020

In compliance with the European Union's ePrivacy Directive, Sprout's Instagram Story Reply metrics will no longer include activity from users in the EEA. Click [here](https://support.sproutsocial.com/hc/en-us/articles/360053598331) for more information. Impacted metrics:

- Instagram Owned Profile Metrics: Story Replies `story_replies`
- Instagram Owned Post Metrics: Story Replies `lifetime.comments_count`

#### [november 2020 permalink](https://api.sproutsocial.com/docs/changelog/\#november-2020) November 2020

Initial Release

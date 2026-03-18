# Metrics and Fields

> Source: [https://api.sproutsocial.com/docs/#metrics-and-fields](https://api.sproutsocial.com/docs/#metrics-and-fields)

### Message Metadata

#### Message Fields

| Key | Type | Network Availability | Notes |
| --- | --- | --- | --- |
| `content_category` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![Google My Business](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | Unified categorization of the content. The hierarchy is album, video, photo, link, poll or text. |
| `created_time` | DATE | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | An iso8601 timestamp representing the publication date and time of the message. |
| `from` | MAP | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | A shorthand for requesting all of the following "from" nested fields. Represents the social network profile that published the message. |
| `from.guid` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | The native ID of the authors' profile prefixed with a Sprout code that represents where the data was collected. |
| `from.name` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | The display name of the author. |
| `from.profile_picture` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | URL to the profile picture. |
| `from.screen_name` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | Also commonly called "handle," this field is mutable on most networks, but not changed as often as the display name. |
| `guid` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | The native ID of the message prefixed with a Sprout code that represents where this type of message is. |
| `customer_profile_id` | NUMBER | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | ID of the profile associated with this message. Corresponds to the `customer_profile_id` in the requested `filters`. |
| `internal` | MAP | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | A shorthand for requesting `internal.tags.id` and `internal.sent_by.id`. |
| `internal.tags.id` | ARRAY<NUMBER> | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | Array of tag IDs this message is associated with. Includes active and archived tags. Note that if `group_id` is specified, only tags scoped to that `group_id` will be included. |
| `internal.sent_by.id` | NUMBER | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | ID of the team member that sent this message via Sprout. |
| `internal.sent_by.email` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | Email address of the team member that sent this message. |
| `internal.sent_by.first_name` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | First name of the team member that sent this message. |
| `internal.sent_by.last_name` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | Last name of the team member that sent this message. |
| `sent` | BOOLEAN | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | _(Posts endpoint only)_<br>If the message is sent by the requested profiles, true. Otherwise, the message is considered received by the requested profile(s) and returned false. |
| `post_type` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | Uniquely identifies the social network and type of message this is. Refer to the [Post Types table](https://api.sproutsocial.com/docs/#post-types) for full list of valid post\_types |
| `post_category` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | A unified version of `post_type`, these names are not network specific. |
| `network` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | The social network that the data came from (e.g. INSTAGRAM). |
| `perma_link` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | URL to the message on the social network. |
| `inbox_permalink` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | URL to the message thread in the Sprout Social Smart Inbox. Note that this field is disallowed if not when not using a group\_id filter (an exception is if using `message_id` as a filter, but returned URL will be invalid) |
| `profile_guid` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | The ID of the profile being tracked prefixed with an Sprout code that represents where the data was collected. When the message was made by the profile being tracked, this field will be identical to from.guid. |
| `text` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | The text in the body of the message. |
| `title` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png) | Text that is separate from the usual body of the message, usually shown as a title for the message in the social network. |
| `clickthrough_link` | MAP | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![Google My Business](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | Metadata about a link to another entity that appears on the message, e.g. when a Pinterest message contains a link to a different website. <br>Note: For LinkedIn, only posts that have a `link` content type (posts that contain a link, but no photo or video) are supported. |
| `clickthrough_link.name` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![Google My Business](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | _(Optional)_<br>The name given to the link as named during post time. |
| `clickthrough_link.long` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![Google My Business](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | _(Optional)_<br>The full length (long) URL to the link. |
| `clickthrough_link.short` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![Google My Business](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | _(Optional)_<br>The short URL of the given link, either provided at post time or generated. |
| `hashtags` | ARRAY<STRING> | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png) | Array of hashtags associated with the message (does not include the "#" character). |
| `visual_media` | ARRAY<MAP> | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![Google My Business](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | Array of media shared on the message, e.g. photos and videos. Where possible, contains URLs for the full media, a high resolution display image and a thumbnail image. |
| `pinterest.board_name` | STRING | ![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png) | _(Posts endpoint only)_<br>The name of the collection where users save specific pins. |
| `is_boosted` | BOOLEAN | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png) | _(Posts endpoint only)_<br>A Boolean field that indicates whether the organic posts have received paid promotion to increase reach. |
| `activity_metadata` | ARRAY<MAP> | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | _(Messages endpoint only)_<br>Contains information about **the first of each** Sprout Action(s) taken on a message, such as actor and timestamp. Depending on network limitations, this may include Reply, Tag, Complete and Like actions. |
| `case_id` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | _(Messages endpoint only)_<br>Case id of the case a message is attached. |
| `language_code` | STRING | ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png)![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png)![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | _(Messages endpoint only)_<br>ISO 639-1 language code of the message. `un` if unable to be determined. |
| `review_ratings` | ARRAY<MAP> | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png)![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png)![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png) | _(Messages endpoint only)_<br>List of review ratings, defined as a map of value to scale. |

#### Listening Message Fields

| Key | Type | Network Availability | Notes |
| --- | --- | --- | --- |
| `content_category` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | Unified categorization of the content. The hierarchy is album, video, photo, link, poll or text. |
| `created_time` | DATE | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | An iso8601 timestamp representing the publication date and time of the message. |
| `from.guid` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | The native ID of the authors' profile prefixed with a Sprout code that represents where the data was collected. |
| `from.name` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | The display name of the author. |
| `from.profile_picture` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | URL to the profile picture. |
| `from.screen_name` | STRING | ![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | Also commonly called "handle," this field is mutable on most networks, but not changed as often as the display name. |
| `from.profile_url` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Web](https://api.sproutsocial.com/docs/static/ea37131ee66cb2ccc476ca96d1674389/5fe69/web.png)![Tumblr](https://api.sproutsocial.com/docs/static/5692177720d28fbdea5ba9449c017514/a8401/tumblr.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | A url back to the author profile. |
| `from.followers_count` | NUMBER | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Web](https://api.sproutsocial.com/docs/static/ea37131ee66cb2ccc476ca96d1674389/5fe69/web.png)![Tumblr](https://api.sproutsocial.com/docs/static/5692177720d28fbdea5ba9449c017514/a8401/tumblr.png) | The latest number of followers for the profile. |
| `guid` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | The native ID of the message prefixed with a Sprout code that represents where this type of message is. |
| `network` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | The social network that the data came from (e.g. INSTAGRAM). |
| `perma_link` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | URL to the message on the social network. |
| `profile_guid` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | The ID of the profile being tracked prefixed with an Sprout code that represents where the data was collected. When the message was made by the profile being tracked, this field will be identical to from.guid. |
| `text` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | The text in the body of the message. |
| `title` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png) | Text that is separate from the usual body of the message, usually shown as a title for the message in the social network. |
| `hashtags` | ARRAY<STRING> | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | Array of hashtags associated with the message (does not include the "#" character). |
| `visual_media` | ARRAY<MAP> | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | Array of media shared on the message, e.g. photos and videos. Where possible, contains URLs for the full media, a high resolution display image and a thumbnail image. |
| `sentiment` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Web](https://api.sproutsocial.com/docs/static/ea37131ee66cb2ccc476ca96d1674389/5fe69/web.png)![Tumblr](https://api.sproutsocial.com/docs/static/5692177720d28fbdea5ba9449c017514/a8401/tumblr.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | The sentiment category (e.g. positive, neutral, negative, etc) of the message. |
| `sentiment_raw` | NUMBER | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Web](https://api.sproutsocial.com/docs/static/ea37131ee66cb2ccc476ca96d1674389/5fe69/web.png)![Tumblr](https://api.sproutsocial.com/docs/static/5692177720d28fbdea5ba9449c017514/a8401/tumblr.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | A raw sentiment score between 1 and -1. Scores closer to 1 are more likely to be positive while scores closer to -1 are more likely to be negative. |
| `language` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Web](https://api.sproutsocial.com/docs/static/ea37131ee66cb2ccc476ca96d1674389/5fe69/web.png)![Tumblr](https://api.sproutsocial.com/docs/static/5692177720d28fbdea5ba9449c017514/a8401/tumblr.png)![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | The primary language of the text. The primary language is selected based on which language makes up most of the text. |
| `location.city` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Web](https://api.sproutsocial.com/docs/static/ea37131ee66cb2ccc476ca96d1674389/5fe69/web.png)![Tumblr](https://api.sproutsocial.com/docs/static/5692177720d28fbdea5ba9449c017514/a8401/tumblr.png) | An estimation of the city where the message was posted. Location data exists on X only. In some instances, we take content from the authors bio or the message itself to determine location information for other networks. |
| `location.province` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Web](https://api.sproutsocial.com/docs/static/ea37131ee66cb2ccc476ca96d1674389/5fe69/web.png)![Tumblr](https://api.sproutsocial.com/docs/static/5692177720d28fbdea5ba9449c017514/a8401/tumblr.png) | An estimation of the province where the message was posted. Location data exists on X only. In some instances, we take content from the authors bio or the message itself to determine location information for other networks. |
| `location.country` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Web](https://api.sproutsocial.com/docs/static/ea37131ee66cb2ccc476ca96d1674389/5fe69/web.png)![Tumblr](https://api.sproutsocial.com/docs/static/5692177720d28fbdea5ba9449c017514/a8401/tumblr.png) | An estimation of the country where the message was posted. Location data exists on X only. In some instances, we take content from the authors bio or the message itself to determine location information for other networks. |
| `source.name` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Web](https://api.sproutsocial.com/docs/static/ea37131ee66cb2ccc476ca96d1674389/5fe69/web.png)![Tumblr](https://api.sproutsocial.com/docs/static/5692177720d28fbdea5ba9449c017514/a8401/tumblr.png) | The name of the publication or page. e.g. "The New York Times" |
| `source.url` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Web](https://api.sproutsocial.com/docs/static/ea37131ee66cb2ccc476ca96d1674389/5fe69/web.png)![Tumblr](https://api.sproutsocial.com/docs/static/5692177720d28fbdea5ba9449c017514/a8401/tumblr.png) | The link to the publication or page. |
| `parent_message_id` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Web](https://api.sproutsocial.com/docs/static/ea37131ee66cb2ccc476ca96d1674389/5fe69/web.png)![Tumblr](https://api.sproutsocial.com/docs/static/5692177720d28fbdea5ba9449c017514/a8401/tumblr.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | If the message was a reply, this will hold an ID of the parent message. |
| `explicit_label` | STRING | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Web](https://api.sproutsocial.com/docs/static/ea37131ee66cb2ccc476ca96d1674389/5fe69/web.png)![Tumblr](https://api.sproutsocial.com/docs/static/5692177720d28fbdea5ba9449c017514/a8401/tumblr.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | A true or false indication of whether the message contains explicit content. |
| `explicit_probability` | NUMBER | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Web](https://api.sproutsocial.com/docs/static/ea37131ee66cb2ccc476ca96d1674389/5fe69/web.png)![Tumblr](https://api.sproutsocial.com/docs/static/5692177720d28fbdea5ba9449c017514/a8401/tumblr.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | A probability that the message contains explicit content. |
| `mentions` | ARRAY<STRING> | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Web](https://api.sproutsocial.com/docs/static/ea37131ee66cb2ccc476ca96d1674389/5fe69/web.png)![Tumblr](https://api.sproutsocial.com/docs/static/5692177720d28fbdea5ba9449c017514/a8401/tumblr.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | A list of other profiles mentioned in the message. |
| `emoticons` | ARRAY<STRING> | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Web](https://api.sproutsocial.com/docs/static/ea37131ee66cb2ccc476ca96d1674389/5fe69/web.png)![Tumblr](https://api.sproutsocial.com/docs/static/5692177720d28fbdea5ba9449c017514/a8401/tumblr.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | A list of emoticons (e.g. emoji) used in the message. |
| `keywords` | ARRAY<STRING> | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Web](https://api.sproutsocial.com/docs/static/ea37131ee66cb2ccc476ca96d1674389/5fe69/web.png)![Tumblr](https://api.sproutsocial.com/docs/static/5692177720d28fbdea5ba9449c017514/a8401/tumblr.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | A list of keywords or phrases used in the message. |
| `related_words` | ARRAY<STRING> | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Web](https://api.sproutsocial.com/docs/static/ea37131ee66cb2ccc476ca96d1674389/5fe69/web.png)![Tumblr](https://api.sproutsocial.com/docs/static/5692177720d28fbdea5ba9449c017514/a8401/tumblr.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | A list of related keywords used in the message. |
| `document.theme_ids` | ARRAY<STRING> | ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png)![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png)![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png)![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png)![Web](https://api.sproutsocial.com/docs/static/ea37131ee66cb2ccc476ca96d1674389/5fe69/web.png)![Tumblr](https://api.sproutsocial.com/docs/static/5692177720d28fbdea5ba9449c017514/a8401/tumblr.png)![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | A list of theme\_ids for themes that include the message. |

### Post Types

| Network | post\_type value | Description |
| :-: | --- | --- |
| ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png) | TWEET | Post |
| ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png) | RETWEET | Repost |
| ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png) | RETWEET\_COMMENT | Repost Comment |
| ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png) | TWITTER\_DIRECT\_MESSAGE | X DM |
| ![X](https://api.sproutsocial.com/docs/static/d59d570c33b17175dcd26c6d21861195/a8401/x.png) | TWITTER\_FOLLOWER\_ALERT | X Follower Alert |
| ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png) | FACEBOOK\_POST | Regular FB Post (may include ‘Organic Posts’ and Dynamic Ads) |
| ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png) | FBCR\_COMMENT | FB Comment on a Post |
| ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png) | FACEBOOK\_AD | FB Ad Post (excluding Dynamic Ads) |
| ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png) | FACEBOOK\_AD\_COMMENT | FB Comment on an Ad Post |
| ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png) | FACEBOOK\_MESSENGER\_PM | FB Messenger Private Message |
| ![Facebook](https://api.sproutsocial.com/docs/static/25d59608650a865e412d7986603a014a/a8401/facebook.png) | FACEBOOK\_RATING | FB Rating |
| ![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png) | INSTAGRAM\_MEDIA | IG Media |
| ![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png) | INSTAGRAM\_MEDIA\_CAPTION\_MENTION | IG Media Caption Mention |
| ![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png) | INSTAGRAM\_PHOTO\_TAG | IG Media Tag |
| ![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png) | INSTAGRAM\_DIRECT\_MESSAGE | IG DM |
| ![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png) | INSTAGRAM\_STORY | IG Story |
| ![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png) | INSTAGRAM\_STORY\_MENTION | IG Story Mention |
| ![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png) | INSTAGRAM\_COMMENT\_MENTION | IG Comment Mention |
| ![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png) | INSTAGRAM\_GRAPH\_COMMENT | IG Comment |
| ![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png) | FB\_INSTAGRAM\_AD\_POST | IG Ad Post |
| ![Instagram](https://api.sproutsocial.com/docs/static/df5d891fdeaeac3567808e820b4e3726/a8401/instagram.png) | FB\_INSTAGRAM\_AD\_COMMENT | IG Comment on an Ad Post |
| ![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png) | TIKTOK\_VIDEO | Tiktok Video |
| ![TikTok](https://api.sproutsocial.com/docs/static/66f6e2a21235f8726ced5560020ce111/a8401/tiktok.png) | TIKTOK\_VIDEO\_COMMENT | Tiktok comment on a Video |
| ![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png) | PINTEREST\_PIN | Pinterest Pin |
| ![Pinterest](https://api.sproutsocial.com/docs/static/b4d32bae6d2509c5f9834d95cd753563/a8401/pinterest.png) | PINTEREST\_REPIN | Pinterest Repin |
| ![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png) | APPLE\_APPSTORE\_REVIEW | Apple App Store Review |
| ![AppleAppStore](https://api.sproutsocial.com/docs/static/21fd1f3315d2270d030976b976e6092a/a8401/apple-app-store.png) | APPLE\_APPSTORE\_REVIEW\_REPLY | Apple App Store Reply to Review |
| ![Bluesky](https://api.sproutsocial.com/docs/static/a6690767899475e5c81d277410298386/a8401/bluesky.png) | BLUESKY\_POST | Bluesky Post |
| ![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png) | GOOGLE\_MY\_BUSINESS\_REVIEW | Google My Business (GMB) Review |
| ![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png) | GOOGLE\_MY\_BUSINESS\_REVIEW\_REPLY | Google My Business (GMB) Reply to Review |
| ![GoogleMyBusiness](https://api.sproutsocial.com/docs/static/9230071986bb3e60bd9d1db5ad719a9b/a8401/google-my-business.png) | GOOGLE\_MY\_BUSINESS\_POST | Google My Business Public Post |
| ![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png) | GOOGLE\_PLAYSTORE\_REVIEW | Google Play Store Review |
| ![GooglePlayStore](https://api.sproutsocial.com/docs/static/a7ebf137c6d091fc0ba5f6c7dd31c68d/a8401/google-play-store.png) | GOOGLE\_PLAYSTORE\_REVIEW\_REPLY | Google Play Store Reply to Review |
| ![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png) | LINKEDIN\_COMPANY\_COMMENT | LinkedIn Company Comment |
| ![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png) | LINKEDIN\_COMPANY\_UPDATE | LinkedIn Company Update |
| ![LinkedIn](https://api.sproutsocial.com/docs/static/de4e532c98618e202071394116c60c6b/a8401/linkedin.png) | LINKEDIN\_PERSONAL\_POST | LinkedIn Personal Post |
| ![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png) | THREADS\_POST | Threads Post |
| ![Threads](https://api.sproutsocial.com/docs/static/3ea661ce68732727ffc0cfe73d759cfc/a8401/threads.png) | THREADS\_REPLY | Threads Reply |
| ![Whatsapp](https://api.sproutsocial.com/docs/static/b5027f37a93d0dfb95abdae439378a68/a8401/whatsapp.png) | WHATSAPP\_DIRECT\_MESSAGE | Whatsapp Message |
| ![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png) | YOUTUBE\_VIDEO | Youtube Video |
| ![YouTube](https://api.sproutsocial.com/docs/static/f69fbffb34d031b502c67aebd5d8b046/a8401/youtube.png) | YOUTUBE\_COMMENT | Youtube Comment |

### Topic Metrics

| Metric | Key |
| --- | --- |
| Total Engagement | `engagements` |
| Total Likes | `likes` |
| Total Replies | `replies` |
| Total Shares | `shares_count` |
| Author Follower Count | `from.followers_count` |
| Authors count | `authors_count` |
| Count of Positive Messages | `positive_sentiments_count` |
| Count of Neutral Messages | `neutral_sentiments_count` |
| Count of Negative Messages | `negative_sentiments_count` |
| Total Potential Impressions | `impressions` |
| Volume or Topic Messages | `messages_count` |

### X

**Note: X has additional review and compliance requirements around exposing data through the Sprout Analytics API. Customers are required to undergo a brief X review and approval process before being able to access their X data through the Sprout Analytics API. X data is not available for Listening endpoints.**

#### X: Owned Profile Metrics

| Metric | Key | Availability |
| --- | --- | --- |
| Followers | `lifetime_snapshot.followers_count` | General Availability |
| Net Follower Growth | `net_follower_growth` | General Availability |
| Impressions | `impressions` | General Availability |
| Media Views | `post_media_views` | Premium Analytics Required |
| Video Views | `video_views` | General Availability |
| Reactions | `reactions` | General Availability |
| Likes | `likes` | General Availability |
| @Replies | `comments_count` | General Availability |
| Reposts | `shares_count` | General Availability |
| Post Clicks (All) | `post_content_clicks` | General Availability |
| Post Link Clicks | `post_link_clicks` | General Availability |
| Other Post Clicks | `post_content_clicks_other` | General Availability |
| Post Media Clicks | `post_media_clicks` | Premium Analytics Required |
| Post Hashtag Clicks | `post_hashtag_clicks` | Premium Analytics Required |
| Post Detail Expand Clicks | `post_detail_expand_clicks` | Premium Analytics Required |
| Profile Clicks | `post_profile_clicks` | Premium Analytics Required |
| Other Engagements | `engagements_other` | General Availability |
| App Engagements | `post_app_engagements` | Premium Analytics Required |
| App Install Attempts | `post_app_installs` | Premium Analytics Required |
| App Opens | `post_app_opens` | Premium Analytics Required |
| Posts Sent Count | `posts_sent_count` | General Availability |
| Posts Sent By Post Type | `posts_sent_by_post_type` | General Availability |
| Posts Sent By Content Type | `posts_sent_by_content_type` | General Availability |

#### X: Calculated Profile Metrics

_The following metrics are derived from owned profile metrics:_

- **Followers** = the last available `lifetime_snapshot.followers_count` metric
- **(Sprout’s default) Engagements** = Likes + @Replies + Reposts + Post Link Clicks + Other Post Clicks + Other Engagements
- **Engagement Rate (per Follower)** = Engagements / Followers
- **Engagement Rate (per Impression)** = Engagements / Impressions
- **Click-Through Rate** = Post Link Clicks / Impressions

#### X: Post Metrics

| Metric | Key | Availability |
| --- | --- | --- |
| Impressions | `lifetime.impressions` | General Availability |
| Media Views | `lifetime.post_media_views` | Premium Analytics Required |
| Video Views | `lifetime.video_views` | General Availability |
| Reactions | `lifetime.reactions` | General Availability |
| Likes | `lifetime.likes` | General Availability |
| @Replies | `lifetime.comments_count` | General Availability |
| Reposts | `lifetime.shares_count` | General Availability |
| Post Clicks (All) | `lifetime.post_content_clicks` | General Availability |
| Post Link Clicks | `lifetime.post_link_clicks` | General Availability |
| Other Post Clicks | `lifetime.post_content_clicks_other` | General Availability |
| Post Media Clicks | `lifetime.post_media_clicks` | Premium Analytics Required |
| Post Hashtag Clicks | `lifetime.post_hashtag_clicks` | Premium Analytics Required |
| Post Detail Expand Clicks | `lifetime.post_detail_expand_clicks` | Premium Analytics Required |
| Profile Clicks | `lifetime.post_profile_clicks` | Premium Analytics Required |
| Other Engagements | `lifetime.engagements_other` | General Availability |
| Follows from Posts | `lifetime.post_followers_gained` | Premium Analytics Required |
| Unfollows from Posts | `lifetime.post_followers_lost` | Premium Analytics Required |
| App Engagements | `lifetime.post_app_engagements` | Premium Analytics Required |
| App Install Attempts | `lifetime.post_app_installs` | Premium Analytics Required |
| App Opens | `lifetime.post_app_opens` | Premium Analytics Required |
| Positive Comments | `lifetime.sentiment_comments_positive_count` | Premium Analytics Required |
| Negative Comments | `lifetime.sentiment_comments_negative_count` | Premium Analytics Required |
| Neutral Comments | `lifetime.sentiment_comments_neutral_count` | Premium Analytics Required |
| Unclassified Comments | `lifetime.sentiment_comments_unclassified_count` | Premium Analytics Required |
| Net Sentiment Score | `lifetime.net_sentiment_score` | Premium Analytics Required |

#### X: Calculated Post Metrics

_The following metrics are derived from post metrics:_

- **(Sprout’s default) Engagements** = Likes + @Replies + Reposts + Post Link Clicks + Other Post Clicks + Other Engagements
- **Engagement Rate (per Follower)** = Engagements / Followers
- **Engagement Rate (per Impression)** = Engagements / Impressions
- **Click-Through Rate** = Post Link Clicks / Impressions

### Facebook

#### Deprecated Metrics

On November 15, 2025, Meta deprecated several Facebook metrics related to impressions. Metrics in the below table that
appear in the **Sprout Metric Being Replaced** column [in this article](https://support.sproutsocial.com/hc/en-us/articles/39899335524493-Facebook-Metric-Deprecation-November-2025) will
use different Facebook metrics depending on the date. For example, profile impressions will represent impressions prior to 2025. Starting January 1, 2025, profile impressions
will represent views.

#### Facebook: Owned Profile Metrics

| Metric | Key | Availability |
| --- | --- | --- |
| Followers | `lifetime_snapshot.followers_count` | General Availability |
| Net Follower Growth | `net_follower_growth` | General Availability |
| Followers Gained | `followers_gained` | General Availability |
| Organic Followers Gained | `followers_gained_organic` | General Availability |
| Paid Followers Gained | `followers_gained_paid` | General Availability |
| Page Unlikes | `followers_lost` | General Availability |
| Fans | `lifetime_snapshot.fans_count` | General Availability |
| Page Likes | `fans_gained` | General Availability |
| Organic Page Likes | `fans_gained_organic` | General Availability |
| Paid Page Likes | `fans_gained_paid` | General Availability |
| Page Unlikes | `fans_lost` | General Availability |
| Impressions | `impressions` | General Availability |
| Organic Impressions | `impressions_organic` | General Availability |
| Viral Impressions | `impressions_viral` | Premium Analytics Required |
| Non-viral Impressions | `impressions_nonviral` | Premium Analytics Required |
| Paid Impressions | `impressions_paid` | General Availability |
| Total Impressions | `impressions_total` | General Availability |
| Page Tab Views | `tab_views` | Premium Analytics Required |
| Logged In Page Tab Views | `tab_views_login` | Premium Analytics Required |
| Logged Out Page Tab Views | `tab_views_logout` | Premium Analytics Required |
| Post Impressions | `post_impressions` | Premium Analytics Required |
| Organic Post Impressions | `post_impressions_organic` | Premium Analytics Required |
| Viral Post Impressions | `post_impressions_viral` | Premium Analytics Required |
| Non-viral Post Impressions | `post_impressions_nonviral` | Premium Analytics Required |
| Paid Post Impressions | `post_impressions_paid` | Premium Analytics Required |
| Reach | `impressions_unique` | General Availability |
| Organic Reach | `impressions_organic_unique` | General Availability |
| Viral Reach | `impressions_viral_unique` | Premium Analytics Required |
| Non-viral Reach | `impressions_nonviral_unique` | Premium Analytics Required |
| Paid Reach | `impressions_paid_unique` | General Availability |
| Reactions | `reactions` | General Availability |
| Comments | `comments_count` | General Availability |
| Shares | `shares_count` | General Availability |
| Post Link Clicks | `post_link_clicks` | General Availability |
| Other Post Clicks | `post_content_clicks_other` | General Availability |
| Page Actions | `profile_actions` | General Availability |
| Post Engagements | `post_engagements` | Premium Analytics Required |
| Video Views | `video_views` | General Availability |
| Organic Video Views | `video_views_organic` | General Availability |
| Paid Video Views | `video_views_paid` | General Availability |
| Autoplay Video Views | `video_views_autoplay` | Premium Analytics Required |
| Click to Play Video Views | `video_views_click_to_play` | Premium Analytics Required |
| Replayed Video Views | `video_views_repeat` | Premium Analytics Required |
| Video View Time | `video_view_time` | Premium Analytics Required |
| Unique Video Views | `video_views_unique` | Premium Analytics Required |
| Full Video Views | `video_views_30s_complete` | Premium Analytics Required |
| Organic Full Video Views | `video_views_30s_complete_organic` | Premium Analytics Required |
| Paid Full Video Views | `video_views_30s_complete_paid` | Premium Analytics Required |
| Autoplay Full Video Views | `video_views_30s_complete_autoplay` | Premium Analytics Required |
| Click to Play Full Video Views | `video_views_30s_complete_click_to_play` | Premium Analytics Required |
| Replayed Full Video Views | `video_views_30s_complete_repeat` | Premium Analytics Required |
| Unique Full Video Views | `video_views_30s_complete_unique` | Premium Analytics Required |
| Partial Video Views | `video_views_partial` | Premium Analytics Required |
| Organic Partial Video Views | `video_views_partial_organic` | Premium Analytics Required |
| Paid Partial Video Views | `video_views_partial_paid` | Premium Analytics Required |
| Autoplay Partial Video Views | `video_views_partial_autoplay` | Premium Analytics Required |
| Click to Play Partial Video Views | `video_views_partial_click_to_play` | Premium Analytics Required |
| Replayed Partial Video Views | `video_views_partial_repeat` | Premium Analytics Required |
| Posts Sent Count | `posts_sent_count` | General Availability |
| Posts Sent By Post Type | `posts_sent_by_post_type` | General Availability |
| Posts Sent By Content Type | `posts_sent_by_content_type` | General Availability |

#### Facebook: Calculated Profile Metrics

_The following metrics are derived from owned profile metrics:_

- **Fans** = the last available `lifetime_snapshot.followers_count` metric
- **(Sprout’s default) Engagements** = Reactions + Comments + Shares + Post Link Clicks + Other Post Clicks
- **Engagement Rate (per Follower)** = Engagements / Followers
- **Engagement Rate (per Impression)** = Engagements / Impressions
- **Click-Through Rate** = Post Link Clicks / Impressions

#### Facebook: Post Metrics

#### Deprecated Metrics

On November 15, 2025, Meta deprecated several Facebook metrics related to impressions. Metrics in the below table that
appear in the **Sprout Metric Being Replaced** column [in this article](https://support.sproutsocial.com/hc/en-us/articles/39899335524493-Facebook-Metric-Deprecation-November-2025) will
use different Facebook metrics depending on the date. For example, post impressions will represent impressions prior to 2025. Starting January 1, 2025, post impressions
will represent views.

| Metric | Key | Availability |
| --- | --- | --- |
| Impressions | `lifetime.impressions` | General Availability |
| Organic Impressions | `lifetime.impressions_organic` | General Availability |
| Viral Impressions | `lifetime.impressions_viral` | Premium Analytics Required |
| Non-viral Impressions | `lifetime.impressions_nonviral` | Premium Analytics Required |
| Paid Impressions | `lifetime.impressions_paid` | General Availability |
| Fan Impressions | `lifetime.impressions_follower` | Premium Analytics Required |
| Non-fan Impressions | `lifetime.impressions_nonfollower` | Premium Analytics Required |
| Reach | `lifetime.impressions_unique` | General Availability |
| Organic Reach | `lifetime.impressions_organic_unique` | General Availability |
| Viral Reach | `lifetime.impressions_viral_unique` | Premium Analytics Required |
| Non-viral Reach | `lifetime.impressions_nonviral_unique` | Premium Analytics Required |
| Paid Reach | `lifetime.impressions_paid_unique` | General Availability |
| Fan Reach | `lifetime.impressions_follower_unique` | Premium Analytics Required |
| Reactions | `lifetime.reactions` | General Availability |
| Likes | `lifetime.likes` | General Availability |
| Love Reactions | `lifetime.reactions_love` | General Availability |
| Haha Reactions | `lifetime.reactions_haha` | General Availability |
| Wow Reactions | `lifetime.reactions_wow` | General Availability |
| Sad Reactions | `lifetime.reactions_sad` | General Availability |
| Angry Reactions | `lifetime.reactions_angry` | General Availability |
| Comments | `lifetime.comments_count` | General Availability |
| Shares | `lifetime.shares_count` | General Availability |
| Post Shares | `lifetime.post_shares_count` | General Availability |
| Answers | `lifetime.question_answers` | Premium Analytics Required |
| Post Clicks (All) | `lifetime.post_content_clicks` | General Availability |
| Post Link Clicks | `lifetime.post_link_clicks` | General Availability |
| Post Photo View Clicks | `lifetime.post_photo_view_clicks` | General Availability |
| Post Video Play Clicks | `lifetime.post_video_play_clicks` | General Availability |
| Other Post Clicks | `lifetime.post_content_clicks_other` | General Availability |
| Video Length | `video_length` | Premium Analytics Required |
| Video Views | `lifetime.video_views` | General Availability |
| Organic Video Views | `lifetime.video_views_organic` | General Availability |
| Paid Video Views | `lifetime.video_views_paid` | General Availability |
| Autoplay Video Views | `lifetime.video_views_autoplay` | Premium Analytics Required |
| Click to Play Video Views | `lifetime.video_views_click_to_play` | Premium Analytics Required |
| Sound on Video Views | `lifetime.video_views_sound_on` | Premium Analytics Required |
| Sound off Video Views | `lifetime.video_views_sound_off` | Premium Analytics Required |
| Partial Video Views | `lifetime.video_views_partial` | Premium Analytics Required |
| Organic Partial Video Views | `lifetime.video_views_partial_organic` | Premium Analytics Required |
| Paid Partial Video Views | `lifetime.video_views_partial_paid` | Premium Analytics Required |
| Autoplay Partial Video Views | `lifetime.video_views_partial_autoplay` | Premium Analytics Required |
| Click to Play Partial Video Views | `lifetime.video_views_partial_click_to_play` | Premium Analytics Required |
| Full Video Views | `lifetime.video_views_30s_complete` | Premium Analytics Required |
| Organic Full Video Views | `lifetime.video_views_30s_complete_organic` | Premium Analytics Required |
| Paid Full Video Views | `lifetime.video_views_30s_complete_paid` | Premium Analytics Required |
| Autoplay Full Video Views | `lifetime.video_views_30s_complete_autoplay` | Premium Analytics Required |
| Click to Play Full Video Views | `lifetime.video_views_30s_complete_click_to_play` | Premium Analytics Required |
| 95% Video Views | `lifetime.video_views_p95` | Premium Analytics Required |
| Organic 95% Video Views | `lifetime.video_views_p95_organic` | Premium Analytics Required |
| Paid 95% Video Views | `lifetime.video_views_p95_paid` | Premium Analytics Required |
| Reels Unique Session Plays | `lifetime.reels_unique_session_plays` | General Availability |
| Unique Video Views | `lifetime.video_views_unique` | Premium Analytics Required |
| Unique Organic Video Views | `lifetime.video_views_organic_unique` | Premium Analytics Required |
| Unique Paid Video Views | `lifetime.video_views_paid_unique` | Premium Analytics Required |
| Unique Full Video Views | `lifetime.video_views_30s_complete_unique` | Premium Analytics Required |
| Unique Organic 95% Video Views | `lifetime.video_views_p95_organic_unique` | Premium Analytics Required |
| Unique Paid 95% Video Views | `lifetime.video_views_p95_paid_unique` | Premium Analytics Required |
| Average Video Time Watched | `lifetime.video_view_time_per_view` | Premium Analytics Required |
| Video View Time | `lifetime.video_view_time` | Premium Analytics Required |
| Organic Video View Time | `lifetime.video_view_time_organic` | Premium Analytics Required |
| Paid Video View Time | `lifetime.video_view_time_paid` | Premium Analytics Required |
| Video Ad Break Ad Impressions | `lifetime.video_ad_break_impressions` | Premium Analytics Required |
| Video Ad Break Ad Earnings | `lifetime.video_ad_break_earnings` | Premium Analytics Required |
| Video Ad Break Ad Cost per Impression (CPM) | `lifetime.video_ad_break_cost_per_impression` | Premium Analytics Required |
| Positive Comments | `lifetime.sentiment_comments_positive_count` | Premium Analytics Required |
| Negative Comments | `lifetime.sentiment_comments_negative_count` | Premium Analytics Required |
| Neutral Comments | `lifetime.sentiment_comments_neutral_count` | Premium Analytics Required |
| Unclassified Comments | `lifetime.sentiment_comments_unclassified_count` | Premium Analytics Required |
| Net Sentiment Score | `lifetime.net_sentiment_score` | Premium Analytics Required |

#### Facebook: Calculated Post Metrics

_The following metrics are derived from post metrics:_

- **(Sprout’s default) Engagements** = Reactions + Comments + Shares + Post Link Clicks + Other Post Clicks
- **Engagement Rate (per Follower)** = Engagements / Followers
- **Engagement Rate (per Impression)** = Engagements / Impressions
- **Engagement Rate (per Reach)** = Engagements / Reach
- **Click-Through Rate** = Post Link Clicks / Impressions

### Instagram

#### Instagram: Owned Profile Metrics

| Metric | Key | Availability |
| --- | --- | --- |
| Followers | `lifetime_snapshot.followers_count` | General Availability |
| Followers By Age Gender | `lifetime_snapshot.followers_by_age_gender` | General Availability |
| Followers By City | `lifetime_snapshot.followers_by_city` | General Availability |
| Followers By Country | `lifetime_snapshot.followers_by_country` | General Availability |
| Net Follower Growth | `net_follower_growth` | General Availability |
| Followers Gained | `followers_gained` | General Availability |
| Followers Lost | `followers_lost` | General Availability |
| Following | `lifetime_snapshot.following_count` | General Availability |
| Net Following Growth | `net_following_growth` | General Availability |
| Views | `impressions` | General Availability |
| Paid Views | `impressions_paid` | General Availability |
| Organic Views | `impressions_organic` | General Availability |
| Total Views | `impressions_total` | General Availability |
| Reach | `impressions_unique` | General Availability |
| Post Video Views | `video_views` | General Availability |
| Reactions | `reactions` | General Availability |
| Likes | `likes` | General Availability |
| Comments | `comments_count` | General Availability |
| Saves | `saves` | General Availability |
| Shares | `shares_count` | General Availability |
| Story Replies | `story_replies` | General Availability |
| Posts Sent Count | `posts_sent_count` | General Availability |
| Posts Sent By Post Type | `posts_sent_by_post_type` | General Availability |
| Posts Sent By Content Type | `posts_sent_by_content_type` | General Availability |
| Total Views | `views` | General Availability |

#### Instagram: Calculated Profile Metrics

_The following metrics are derived from owned profile metrics:_

- **Followers** = the last available `lifetime_snapshot.followers_count` metric
- **(Sprout’s default) Engagements** = Likes + Comments + Shares + Saves + Story Replies
- **Engagement Rate (per Follower)** = Engagements / Followers
- **Engagement Rate (per Impression)** = Engagements / Impressions

#### Instagram: Post Metrics

| Metric | Key | Availability |
| --- | --- | --- |
| Comments | `lifetime.comments_count` | General Availability |
| Impressions | `lifetime.impressions` | General Availability |
| Likes | `lifetime.likes` | General Availability |
| Reach | `lifetime.impressions_unique` | General Availability |
| Reactions | `lifetime.reactions` | General Availability |
| Reels Unique Session Plays | `lifetime.reels_unique_session_plays` | General Availability |
| Saves | `lifetime.saves` | General Availability |
| Shares | `lifetime.shares_count` | General Availability |
| Post Shares | `lifetime.post_shares_count` | General Availability |
| SproutLink Clicks | `lifetime.link_in_bio_clicks` | General Availability |
| Story Exits | `lifetime.story_exits` | General Availability |
| Story Replies | `lifetime.comments_count` | General Availability |
| Story Taps Back | `lifetime.story_taps_back` | General Availability |
| Story Taps Forward | `lifetime.story_taps_forward` | General Availability |
| Video Views | `lifetime.video_views` | General Availability |
| Views | `lifetime.views` | General Availability |
| Positive Comments | `lifetime.sentiment_comments_positive_count` | Premium Analytics Required |
| Negative Comments | `lifetime.sentiment_comments_negative_count` | Premium Analytics Required |
| Neutral Comments | `lifetime.sentiment_comments_neutral_count` | Premium Analytics Required |
| Unclassified Comments | `lifetime.sentiment_comments_unclassified_count` | Premium Analytics Required |
| Net Sentiment Score | `lifetime.net_sentiment_score` | Premium Analytics Required |

#### Instagram: Calculated Post Metrics

_The following metrics are derived from post metrics:_

- **(Sprout’s default) Engagements** = Likes + Comments + Shares + Saves + Story Replies
- **Engagement Rate (per Follower)** = Engagements / Followers
- **Engagement Rate (per Impression)** = Engagements / Impressions
- **Engagement Rate (per Reach)** = Engagements / Reach
- **Click-Through Rate** = Post Link Clicks / Impressions

### LinkedIn

#### LinkedIn: Owned Profile Metrics

| Metric | Key | Availability |
| --- | --- | --- |
| Followers | `lifetime_snapshot.followers_count` | General Availability |
| Followers By Job | `followers_by_job_function` | General Availability |
| Followers By Seniority | `followers_by_seniority` | General Availability |
| Net Follower Growth | `net_follower_growth` | General Availability |
| Followers Gained | `followers_gained` | General Availability |
| Organic Followers Gained | `followers_gained_organic` | General Availability |
| Paid Followers Gained | `followers_gained_paid` | General Availability |
| Followers Lost | `followers_lost` | General Availability |
| Impressions | `impressions` | General Availability |
| Reach | `impressions_unique` | General Availability |
| Reactions | `reactions` | General Availability |
| Comments | `comments_count` | General Availability |
| Shares | `shares_count` | General Availability |
| Post Clicks (All) | `post_content_clicks` | General Availability |
| Posts Sent Count | `posts_sent_count` | General Availability |
| Posts Sent By Post Type | `posts_sent_by_post_type` | General Availability |
| Posts Sent By Content Type | `posts_sent_by_content_type` | General Availability |

#### LinkedIn: Calculated Profile Metrics

_The following metrics are derived from owned profile metrics:_

- **Followers** = the last available `lifetime_snapshot.followers_count` metric
- **(Sprout’s default) Engagements** = Reactions + Comments + Shares + Post Clicks (All)
- **Engagement Rate (per Follower)** = Engagements / Followers
- **Engagement Rate (per Impression)** = Engagements / Impressions

#### LinkedIn: Post Metrics

| Metric | Key | Availability |
| --- | --- | --- |
| Impressions | `lifetime.impressions` | General Availability |
| Unique Impressions | `lifetime.impressions_unique` | General Availability |
| Reactions | `lifetime.reactions` | General Availability |
| Comments | `lifetime.comments_count` | General Availability |
| Shares | `lifetime.shares_count` | General Availability |
| Post Shares | `lifetime.post_shares_count` | General Availability |
| Post Clicks (All) | `lifetime.post_content_clicks` | General Availability |
| Video Views | `lifetime.video_views` | General Availability |
| Unique Video Views | `lifetime.video_views_unique` | General Availability |
| Video View Time | `lifetime.video_view_time` | General Availability |
| Poll Votes | `lifetime.vote_count` | General Availability |
| Positive Comments | `lifetime.sentiment_comments_positive_count` | Premium Analytics Required |
| Negative Comments | `lifetime.sentiment_comments_negative_count` | Premium Analytics Required |
| Neutral Comments | `lifetime.sentiment_comments_neutral_count` | Premium Analytics Required |
| Unclassified Comments | `lifetime.sentiment_comments_unclassified_count` | Premium Analytics Required |
| Net Sentiment Score | `lifetime.net_sentiment_score` | Premium Analytics Required |

#### LinkedIn: Calculated Post Metrics

_The following metrics are derived from post metrics:_

- **(Sprout’s default) Engagements** = Reactions + Comments + Shares + Post Clicks (All)
- **Engagement Rate (per Follower)** = Engagements / Followers
- **Engagement Rate (per Impression)** = Engagements / Impressions
- **Engagement Rate (per Reach)** = Engagements / Reach

### YouTube

#### YouTube: Owned Profile Metrics

| Metric | Key | Availability |
| --- | --- | --- |
| Followers | `lifetime_snapshot.followers_count` | General Availability |
| Net Follower Growth | `net_follower_growth` | General Availability |
| Followers Gained | `followers_gained` | General Availability |
| Followers Lost | `followers_lost` | General Availability |
| Posts Sent Count | `posts_sent_count` | General Availability |

#### YouTube: Calculated Profile Metrics

_The following metrics are derived from owned profile metrics:_

- **Net Follower Growth** = Followers Gained - Followers Lost
- **(Sprout’s default) Video Engagements** = Comments + Likes + Dislikes + Shares + Subscribers Gained + Annotation Clicks + Card Clicks
- **(Sprout’s default) Video Engagements Per View** = Video Engagements / Video Views

#### YouTube: Post Metrics

| Metric | Key | Availability |
| --- | --- | --- |
| Annotation Clicks | `lifetime.annotation_clicks` | Premium Analytics Required |
| Annotation Click Rate | `lifetime.annotation_click_through_rate` | Premium Analytics Required |
| Clickable Annotation Impressions | `lifetime.annotation_clickable_impressions` | Premium Analytics Required |
| Closable Annotation Impressions | `lifetime.annotation_closable_impressions` | Premium Analytics Required |
| Annotation Closes | `lifetime.annotation_closes` | Premium Analytics Required |
| Annotation Close Rate | `lifetime.annotation_close_rate` | Premium Analytics Required |
| Annotation Impressions | `lifetime.annotation_impressions` | Premium Analytics Required |
| Card Clicks | `lifetime.card_clicks` | Premium Analytics Required |
| Card Impressions | `lifetime.card_impressions` | Premium Analytics Required |
| Card Click Rate | `lifetime.card_click_rate` | Premium Analytics Required |
| Card Teaser Clicks | `lifetime.card_teaser_clicks` | Premium Analytics Required |
| Card Teaser Impressions | `lifetime.card_teaser_impressions` | Premium Analytics Required |
| Card Teaser Click Rate | `lifetime.card_teaser_click_rate` | Premium Analytics Required |
| Estimated Minutes Watched | `lifetime.estimated_minutes_watched` | General Availability |
| Estimated YT Red Minutes Watched | `lifetime.estimated_red_minutes_watched` | Premium Analytics Required |
| Content Click Other | `lifetime.post_content_clicks_other` | Premium Analytics Required |
| Shares | `lifetime.shares_count` | General Availability |
| Post Shares | `lifetime.post_shares_count` | General Availability |
| Subscribers Gained | `lifetime.subscribers_gained` | General Availability |
| Subscribers Lost | `lifetime.subscribers_lost` | General Availability |
| YT Red Video Views | `lifetime.red_video_views` | Premium Analytics Required |
| Video Views | `lifetime.video_views` | General Availability |
| Video Likes | `lifetime.likes` | General Availability |
| Video Dislikes | `lifetime.dislikes` | General Availability |
| Video Reactions | `lifetime.reactions` | General Availability |
| Video Comments | `lifetime.comments_count` | General Availability |
| Video Added to Playlist | `lifetime.videos_added_to_playlist` | Premium Analytics Required |
| Video From to Playlist | `lifetime.videos_removed_from_playlist` | Premium Analytics Required |
| Positive Comments | `lifetime.sentiment_comments_positive_count` | Premium Analytics Required |
| Negative Comments | `lifetime.sentiment_comments_negative_count` | Premium Analytics Required |
| Neutral Comments | `lifetime.sentiment_comments_neutral_count` | Premium Analytics Required |
| Unclassified Comments | `lifetime.sentiment_comments_unclassified_count` | Premium Analytics Required |
| Net Sentiment Score | `lifetime.net_sentiment_score` | Premium Analytics Required |

#### YouTube: Calculated Post Metrics

_The following metrics are derived from post metrics:_

- **Content Click Other** = Annotation Clicks + Card Clicks
- **Video Reactions** = Likes + Dislikes
- **(Sprout’s default) Video Engagements** = Comments + Likes + Dislikes + Shares + Subscribers Gained + Annotation Clicks + Card Clicks
- **(Sprout’s default) Video Engagements Per View** = Video Engagements/Video Views

### Pinterest

#### Pinterest: Owned Profile Metrics

| Metric | Key | Availability |
| --- | --- | --- |
| Followers Count | `lifetime_snapshot.followers_count` | General Availability |
| Following Count | `lifetime_snapshot.following_count` | General Availability |
| Followers Gained | `followers_gained` | General Availability |
| Followers Lost | `followers_lost` | General Availability |
| Net Follower Growth | `net_follower_growth` | General Availability |
| Net Following Growth | `net_following_growth` | General Availability |
| Pin Count | `pin_count` | General Availability |
| Pin Sent | `inbox_counts_sent` | General Availability |
| Pin Received | `inbox_received_sent` | General Availability |

#### Pinterest: Calculated Post Metrics

_The following metrics are derived from owned profile metrics:_

- **Net Follower Growth** = Followers Gained - Followers Lost

#### Pinterest: Post Metrics

| Metric | Key | Availability |
| --- | --- | --- |
| Comments | `lifetime.comments_count` | General Availability |
| Pin Saves | `lifetime.saves` | General Availability |

### Threads

#### Threads: Owned Profile Metrics

| Metric | Key | Availability |
| --- | --- | --- |
| Followers By Age Gender | `lifetime_snapshot.followers_by_age_gender` | General Availability |
| Followers By City | `lifetime_snapshot.followers_by_city` | General Availability |
| Followers By Country | `lifetime_snapshot.followers_by_country` | General Availability |
| Likes | `likes` | General Availability |
| Profile Views | `profile_views` | General Availability |
| Quotes | `quotes_count` | General Availability |
| Replies | `comments_count` | General Availability |
| Reposts | `reposts_count` | General Availability |
| Shares | `shares_count` | General Availability |

#### Threads: Calculated Profile Metrics

_The following metrics are derived from owned profile metrics:_

- **Shares** = Reposts + Quotes
- **(Sprout’s default) Engagements** = Likes + Replies + Shares

#### Threads: Post Metrics

| Metric | Key | Availability |
| --- | --- | --- |
| Replies | `lifetime.comments_count` | General Availability |
| Impressions | `lifetime.impressions` | General Availability |
| Likes | `lifetime.likes` | General Availability |
| Reactions | `lifetime.reactions` | General Availability |
| Shares | `lifetime.shares_count` | General Availability |
| Post Shares | `lifetime.post_shares_count` | General Availability |
| Positive Comments | `lifetime.sentiment_comments_positive_count` | Premium Analytics Required |
| Negative Comments | `lifetime.sentiment_comments_negative_count` | Premium Analytics Required |
| Neutral Comments | `lifetime.sentiment_comments_neutral_count` | Premium Analytics Required |
| Unclassified Comments | `lifetime.sentiment_comments_unclassified_count` | Premium Analytics Required |
| Net Sentiment Score | `lifetime.net_sentiment_score` | Premium Analytics Required |

#### Threads: Calculated Post Metrics

_The following metrics are derived from post metrics:_

- **(Sprout’s default) Engagements** = Reactions + Comments + Shares
- **Engagement Rate (per Impression)** = Engagements / Impressions

### TikTok

#### TikTok: Owned Profile Metrics

| Metric | Key | Availability |
| --- | --- | --- |
| Comments | `comments_count_total` | General Availability |
| Followers By Country | `lifetime_snapshot.followers_by_country` | General Availability |
| Followers By Gender | `lifetime_snapshot.followers_by_gender` | General Availability |
| Followers Count | `lifetime_snapshot.followers_count` | General Availability |
| Followers Online | `lifetime_snapshot.followers_online` | General Availability |
| Likes | `likes_total` | General Availability |
| Net Follower Growth | `net_follower_growth` | General Availability |
| Published Posts by Post Type | `posts_sent_by_post_type` | General Availability |
| Published Post | `posts_sent_count` | General Availability |
| Profiles Views | `profile_views_total` | General Availability |
| Shares | `shares_count_total` | General Availability |
| Video Views | `video_views_total` | General Availability |

#### TikTok: Calculated Profile Metrics

_The following metrics are derived from owned profile metrics:_

- **(Sprout’s default) Engagements** = Likes + Comments + Shares
- **Engagement Rate (per Impression)** = Engagements / Impressions

#### TikTok: Post Metrics

| Metric | Key | Availability |
| --- | --- | --- |
| Average Video Time Watched | `lifetime.video_view_time_per_view` | General Availability |
| Comments | `lifetime.comments_count` | General Availability |
| Full Video Watch Rate | `lifetime.video_views_p100_per_view` | General Availability |
| Impression Source Follow | `lifetime.impression_source_follow` | General Availability |
| Impression Source For You | `lifetime.impression_source_for_you` | General Availability |
| Impression Source Hashtag | `lifetime.impression_source_hashtag` | General Availability |
| Impression Source Personal Profile | `lifetime.impression_source_personal_profile` | General Availability |
| Impression Source Sound | `lifetime.impression_source_sound` | General Availability |
| Impression Source Unspecified | `lifetime.impression_source_unspecified` | General Availability |
| Likes | `lifetime.likes` | General Availability |
| Reach | `lifetime.impressions_unique` | General Availability |
| Reactions | `lifetime.reactions` | General Availability |
| Shares | `lifetime.shares_count` | General Availability |
| Post Shares | `lifetime.post_shares_count` | General Availability |
| Video Length | `video_length` | Premium Analytics Required |
| Video View Time | `lifetime.video_view_time` | Premium Analytics Required |
| Video Views | `lifetime.video_views` | General Availability |
| Positive Comments | `lifetime.sentiment_comments_positive_count` | Premium Analytics Required |
| Negative Comments | `lifetime.sentiment_comments_negative_count` | Premium Analytics Required |
| Neutral Comments | `lifetime.sentiment_comments_neutral_count` | Premium Analytics Required |
| Unclassified Comments | `lifetime.sentiment_comments_unclassified_count` | Premium Analytics Required |
| Net Sentiment Score | `lifetime.net_sentiment_score` | Premium Analytics Required |

#### TikTok: Calculated Post Metrics

_The following metrics are derived from owned post metrics:_

- **(Sprout’s default) Engagements** = Likes + Comments + Shares
- **Engagement Rate (per Impression)** = Engagements / Impressions

### Bluesky

#### Bluesky: Post Metrics

| Metric | Key | Availability |
| --- | --- | --- |
| Replies | `lifetime.comments_count` | General Availability |
| Likes | `lifetime.likes` | General Availability |
| Quotes | `lifetime.quotes_count` | General Availability |
| Reactions | `lifetime.reactions` | General Availability |
| Reposts | `lifetime.reposts_count` | General Availability |
| Shares | `lifetime.shares_count` | General Availability |

#### Bluesky: Calculated Post Metrics

_The following metrics are derived from post metrics:_

- **Shares** = Reposts + Quotes
- **(Sprout’s default) Engagements** = Replies + Reactions + Shares

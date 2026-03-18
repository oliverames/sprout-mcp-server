# Publishing Post Endpoints

> Source: [https://api.sproutsocial.com/docs/#publishing-post-endpoints](https://api.sproutsocial.com/docs/#publishing-post-endpoints)

### Overview

Create and manage Publishing posts within Sprout that are intended to be published to social networks at a future time.

- Create Publishing Post - Create a Publishing Post (currently only supports posts in Draft status)
- Retrieve Publishing Post - Retrieve a Publishing Post by its `publishing_post_id`

### Limitations

- Only posts created in draft status are supported at this time.
- Instagram Mobile Publisher and story posts cannot be created directly; those will be created as media posts and can be updated within the Sprout UI.
- Supports the following profile types: Instagram Business and Creator, Facebook Pages, Threads, X, LinkedIn Pages and Personal, YouTube, TikTok, Pinterest, and Google My Business
- At this time a post retrieved by its `publishing_post_id` will always have a `delivery_status: PENDING`, even if it has already been published. To retrieve a post that has already been published, use the [Messages Endpoint](https://api.sproutsocial.com/docs/#messages-endpoint) .

#### Requests - Publishing Post Endpoints

The request body for a Publishing Post API request is a JSON object with the following fields:

| Key | Description | Example Value |
| --- | --- | --- |
| `group_id` | ID of the group in which to create the post | `55667788` |
| `customer_profile_ids` | ID of the profile(s) for which to publish the post. <br>Multiple profiles on a post must exist within the same group. | `[2345, 5678]` |
| `is_draft` | Indicates whether the post should be created in draft status.<br>Currently all posts require `"is_draft": true` as only draft post creation is supported. | `true` |
| `text`<br>_(optional - per network)_ | Text of the post. | `"Post text"` |
| `media`<br>_(optional - per network)_ | Array of media object(s) for post media | `[{"media_id": "1234-abcd-7890", "media_type": "PHOTO"}]` |
| `media.media_id` | Media ID obtained from Media Upload endpoint | `"1234-abcd-7890"` |
| `media.media_type` | Supported values are `PHOTO` and `VIDEO` | `"PHOTO"` |
| `delivery`<br>_(optional)_ | Container for post delivery details. Only required for draft scheduled posts. | `{"scheduled_times": ["2024-06-30T18:20:00Z"], "type": "SCHEDULED"}` |
| `delivery.scheduled_times` | Array of iso8601 timestamps in UTC, representing the delivery date and time of the post.<br>Scheduled times must be in the future and any seconds will be rounded down to the nearest minute. | `["2024-10-14T15:00:00Z", "2023-10-16T18:00:00Z"]` |
| `delivery.type` | Only `SCHEDULED` is supported at this time | `"SCHEDULED"` |
| `tag_ids`<br>_(optional)_ | Array of tag IDs to apply to the post | `[123, 456]` |

### Create Publishing Post Endpoint

```
POST /v1/<customer ID>/publishing/posts
```

Create a Publishing Post in Sprout that is intended to be published at a future time. Creating a Post via the API will create one or more posts on the Sprout Publishing Calendar.

#### Draft Post Fan-out

For draft posts, the current behavior in Sprout and via the API will be to create one post on the calendar per profile on the post (this is referred to as “fan-out”). The unique `publishing_post_id` in the response will represent a single post on the Sprout Publishing Calendar.

The API response will not represent the single post on the Sprout Publishing Calendar but instead represent the posts as they would appear on social networks as they would be published in the future.
For example, a post created with two profiles (one Facebook, one Instagram) will be represented by two objects in the response: one representing the future Instagram post and the other representing the future Facebook Post.

Another dimension is possible if the post is scheduled for multiple send times.

For example, if a post has two profiles (one Facebook, one Instagram) and two scheduled send times, the response will contain four objects: two Instagram posts and two Facebook posts, each containing the `deliveries` object with one of the scheduled delivery times.

#### Request Body - Create Publishing Post Endpoint

An example request:

```
{
	"group_id": 55667788,
	"customer_profile_ids": [\
	    2345,\
		5678\
	],
	"is_draft": true,
	"text": "A draft post",
	"delivery": {
		"scheduled_times": [\
			"2024-06-30T18:20:00Z"\
		],
		"type": "SCHEDULED"
	},
	"media": [\
        {\
          "media_id": "1234-abcd-7890",\
          "media_type": "PHOTO"\
        }\
    ]
}
```

#### Response Data - Publishing Post Endpoints

An example response:

```
{
  "data": [\
    {\
      "post_category": "POST",\
      "post_type": "FACEBOOK_POST",\
      "customer_profile_id": "2345",\
      "profile_guid": "fbpr:1112345",\
      "internal": {\
        "publishing": {\
          "publishing_post_id": 4567890,\
          "group_id": 55667788,\
          "is_draft": true,\
          "text": "A draft post",\
          "perma_link": "https://app.sproutsocial.com/publishing/activity/1234/4567890",\
          "deliveries": [\
            {\
              "type": "SCHEDULED",\
              "delivery_status": "PENDING",\
              "scheduled_time": "2024-06-30T18:20:00Z"\
            }\
          ],\
          "media": [\
            {\
              "id": "6789-defg-5678",\
              "media_type": "PHOTO"\
            }\
          ],\
          "created_by": {\
            "id": 1155555,\
            "email": "sprout.user@sproutsocial.com",\
            "first_name": "Sprout",\
            "last_name": "User"\
          },\
          "updated_by": {\
            "id": 1155555,\
            "email": "sprout.user@sproutsocial.com",\
            "first_name": "Sprout",\
            "last_name": "User"\
          },\
          "created_time": "2024-06-24T19:44:32Z",\
          "updated_time": "2024-06-24T19:44:32Z"\
        }\
      }\
    },\
    {\
      "post_category": "POST",\
      "post_type": "INSTAGRAM_MEDIA",\
      "customer_profile_id": "5678",\
      "profile_guid": "ibpr:5556789",\
      "internal": {\
        "publishing": {\
          "publishing_post_id": 4567891,\
          "group_id": 55667788,\
          "is_draft": true,\
          "text": "A draft post",\
          "perma_link": "https://app.sproutsocial.com/publishing/activity/1234/4567891",\
          "deliveries": [\
            {\
              "type": "SCHEDULED",\
              "delivery_status": "PENDING",\
              "scheduled_time": "2024-06-30T18:20:00Z"\
            }\
          ],\
          "media": [\
            {\
              "id": "6789-defg-5678",\
              "media_type": "PHOTO"\
            }\
          ],\
          "created_by": {\
            "id": 1155555,\
            "email": "sprout.user@sproutsocial.com",\
            "first_name": "Sprout",\
            "last_name": "User"\
          },\
          "updated_by": {\
            "id": 1155555,\
            "email": "sprout.user@sproutsocial.com",\
            "first_name": "Sprout",\
            "last_name": "User"\
          },\
          "created_time": "2024-06-24T19:44:32Z",\
          "updated_time": "2024-06-24T19:44:32Z"\
        }\
      }\
    }\
  ]
}
```

### Retrieve Publishing Post Endpoint

```
GET /v1/<customer ID>/publishing/posts/<publishing_post_id>
```

Retrieve a Publishing Post by its `publishing_post_id`. If multiple profiles or send times are present on the post, the response will contain the "fanned-out" posts as they would appear on social networks in the future.

#### Response Data - Retrieve Publishing Post Endpoint

An example response:

```
{
  "data": [\
    {\
      "post_category": "POST",\
      "post_type": "FACEBOOK_POST",\
      "customer_profile_id": "2345",\
      "profile_guid": "fbpr:1112345",\
      "internal": {\
        "publishing": {\
          "publishing_post_id": 4567890,\
          "group_id": 55667788,\
          "is_draft": true,\
          "text": "A draft post",\
          "perma_link": "https://app.sproutsocial.com/publishing/activity/1234/4567890",\
          "deliveries": [\
            {\
              "type": "SCHEDULED",\
              "delivery_status": "PENDING",\
              "scheduled_time": "2024-06-30T18:20:00Z"\
            }\
          ],\
          "media": [\
            {\
              "id": "6789-defg-5678",\
              "media_type": "PHOTO"\
            }\
          ],\
          "created_by": {\
            "id": 1155555,\
            "email": "sprout.user@sproutsocial.com",\
            "first_name": "Sprout",\
            "last_name": "User"\
          },\
          "updated_by": {\
            "id": 1155555,\
            "email": "sprout.user@sproutsocial.com",\
            "first_name": "Sprout",\
            "last_name": "User"\
          },\
          "created_time": "2024-06-24T19:44:32Z",\
          "updated_time": "2024-06-24T19:44:32Z"\
        }\
      }\
    }\
  ]
}
```

### Simple Media Upload

```
POST /v1/<customer ID>/media/
```

The media upload system works with other parts of the public API that require media existing in the Sprout Social systems.
This media upload system supports three different means to send content to sprout:

1. Simple Media Upload
   - Media files are limited to 50MiB in size
2. Multipart Media Upload
   - This scheme relies on uploading a media file 5MiB at a time
3. Download from a Link
   - This scheme relies on a publicly available internet reachable file on http/https hosted URLs
   - This scheme is built into the single upload or multipart upload paths, and can be treated as either depending on
what makes sense for the media file in question. See the individual API endpoint definitions below for the caveats of
using one over the other.

#### Limitations

- Media sent to Sprout via this API are normally retained for 24 hours before is it removed unless used by other API operations

- Currently, the only applicable use of uploaded media is to be used alongside post submissions.

- Uploaded media must be identified as one of the specified supported media types:



| Content Type | Common Extension |
| --- | --- |
| image/png | png |
| image/gif | gif |
| image/webp | webp |
| image/jpeg | jpg |
| image/heic | heic |
| image/avif | avif |
| video/x-msvideo | avi |
| video/quicktime | mov |
| video/mp4 | mp4 |
| video/mpeg | mpg |
| image/heic-sequence | heifs |
| video/hevc | hevc |
| video/avc | avc |
| video/av1 | av1 |
| image/x-heif-jpeg | jpeg |
| image/heif | heif |
| video/webm | webm |
| video/x-matroska | mkv |
| application/x-matroska | mkv |
| application/x-subrip | srt |

  - \\*\\* Note: Although this API supports these content types, the target social networks have their own rules on media files which need to be honored. Sprout will not transcode these files into network compatible versions when used with posts. There are _some_ built-in validation rules we enforce when a media file is used with pending posts, but these limitations may not catch every case where a social network rejects a given media file. See [this](https://support.sproutsocial.com/hc/en-us/articles/115003659326-Media-Upload-Types-and-Size-Limits) help center page for details on known social network media limitations.

This endpoint supports uploading a media file in a single request or to request a link download for a media file existing on the internet.

The request format of this endpoint is `multipart/form-data`. The request must contain one of two request part names to be provided in each request:

1. media - _(Single File Upload)_ The media file contents in bytes

   - The part may contain an optional content disposition which specifies the original content type and file name of the media. Sending this information may help to identify the source content, but it is not mandatory
2. media\_url - _(Link Download via Single File Upload)_ A UTF-8 text part containing the HTTP/HTTPS URL of a media file on the internet

##### Response

A response code of 200 indicates that the part was submitted successfully. Any other status should be accompanied by a descriptive error for why it failed. Generally, requests in the 4xx code range are fatal errors that require a new media request, whereas 5xx failures are temporary and can be retried with an exponential back-off retry policy.

On a successful transfer, the resulting payload will be a JSON document containing a `media_id` text field which can then be used by other API calls when associating said media with post creation activities. The response also contains an `expiration_time` which shows how long the media will be available for use in a pending post. Any requests associating with this expiration time will fail.

##### Limitations

1. Media sent directly larger than 50 MiB will be rejected
2. Media content that is not identified as a know media type will be rejected
3. For link download requests, the network request will remain open and not respond until the link download request has been authorized and fully downloaded.
   - This transaction trades the convenience of a single request/response with the limitation that the link download needs to complete before a network timeout in order to succeed. If you see consistent sets of timeouts when submitting link download requests on this endpoint, it's advisable to switch to the multipart upload API for link downloads.

##### Example Request (Simple File Upload)

```text
  curl -s -X POST \
    --form "media=@$MEDIA_DIR/$MEDIA_FILE;type=image/gif" \
    https://api.sproutsocial.com/v1/$CUSTOMER/media/ \
    -H "authorization: Bearer $TOKEN" \
    -H "Content-Type: multipart/form-data"
```

Response:

```json
{
  "data": [\
    {\
      "media_id": "565fc90f-dd98-4c84-ab17-6f051fb536ce",\
      "expiration_time": "2023-10-12T11:20:16Z"\
    }\
  ]
}
```

##### Example Request (Link Download via Simple File Upload)

```text
  curl -s -X POST \
    --form "media_url=https://my.public.media.com/my_file.jpg" \
    https://api.sproutsocial.com/v1/$CUSTOMER/media/ \
    -H "authorization: Bearer $TOKEN" \
    -H "Content-Type: multipart/form-data"
```

Response:

```json
{
  "data": [\
    {\
      "media_id": "565fc90f-dd98-4c84-ab17-6f051fb536ce",\
      "expiration_time": "2023-10-12T11:20:16Z"\
    }\
  ]
}
```

### Multipart Media Upload

Multipart uploads become necessary when managing files larger than 50 MiB, or when media content is expected to take longer to download via link downloading. This benefit is traded with needing to perform multiple requests to the API in order to achieve similar objectives.

#### Processing Steps

1. Initiate a new request for a Multipart upload using the `Start multipart media upload` steps below.

   - A successful response here will return a JSON `submission_id` which will be needed in each subsequent step
   - The multipart media request must be completed and used within 24 hours of this initial request
2. Upload all other parts of the media file using the `Continue multipart media upload` steps below.

   - Each file part must be a sequential whole number. The initial upload is considered part 1, so each subsequent part must be 2, 3, 4, etc. until the file is entirely uploaded.
   - This can be done sequentially, or in parallel
3. Once **all** parts have been uploaded, finish the upload processing by using the `Complete multipart media upload` steps below.

#### Limitations

1. All media parts uploaded must be exactly 5MiB (5,242,880 bytes) except for the last upload part, which can be any size > 0 bytes
   - For files < 5 MiB send via this API, the "Start multipart media upload" step can receive a file under 5 MiB as long as no subsequent parts are sent.
2. Media content that is not identified as a know media type will be rejected. This content ID will only occur on the first 5 MiB part of the media, so a failed identification within that file chunk will cause the request to fail

#### Start multipart media upload

```
POST /v1/<customer ID>/media/submission
```

This endpoint supports uploading a media file in a single request or to request a link download for a media file existing on the internet.

The request format of this endpoint is `multipart/form-data`. The request must contain one of two request part names to be provided in each request:

1. media - The media file part contents in bytes
   - The part may contain an optional content disposition which specifies the original content type and file name of the media. Sending this information may help to identify the source content, but it is not mandatory
2. media\_url - _(Link Download)_ A UTF-8 text part containing the HTTP/HTTPS URL of a media file on the internet.

   - When if successful, skip to `Complete multipart media upload` to await the completion of the link download requested.

##### Response

A response code of 200 indicates that the part was submitted successfully. Any other status should be accompanied by a descriptive error for why it failed. Generally, requests in the 4xx code range are fatal errors that require a new media request, whereas 5xx failures are temporary and can be retried with an exponential back-off retry policy.

On a successful request, the resulting payload will be a JSON document containing a `submission_id` text field. This field is needed for the follow-up `Continue multipart media upload` and `Complete multipart media upload` steps.

##### Example Request

```text
  curl -s -X POST \
    --form "media=@$MEDIA_DIR/$MEDIA_FILE_PART_1;type=image/gif" \
    https://api.sproutsocial.com/v1/$CUSTOMER/media/submission \
    -H "authorization: Bearer $TOKEN" \
    -H "Content-Type: multipart/form-data"
```

Response:

```json
{
  "data": [\
    {\
      "submission_id": "565fc90f-dd98-4c84-ab17-6f051fb536ce"\
    }\
  ]
}
```

##### Example Request (Link Download)

```text
  curl -s -X POST \
    --form "media_url=https://my.public.media.com/my_file.jpg" \
    https://api.sproutsocial.com/v1/$CUSTOMER/media/submission \
    -H "authorization: Bearer $TOKEN" \
    -H "Content-Type: multipart/form-data"
```

Response:

```json
{
  "data": [\
    {\
      "submission_id": "565fc90f-dd98-4c84-ab17-6f051fb536ce"\
    }\
  ]
}
```

#### Continue multipart media upload

```
POST /v1/<customer ID>/media/submission/<submission_id>/part/<part_number>
```

If the media file part uploaded in `Start multipart media upload` was 5 MiB, and there are still more bytes to upload, the continue multipart media endpoint needs to be called continually with each part of the media file until its entirely uploaded. It uses the same multipart/form-data structure as the initial submission URL, but this one is slightly different.

1. The URL contains a part number. It must represent a whole number starting at `2`. This continues ascending (3,4,5,etc...) until you've upload all the data bytes of the source media.
2. The form's `media` disposition is not needed and will be ignored. The content type of this data is implicitly application/octet-stream

There are no requirements about executing these upload parts in parallel if desired. If any part submission fails, they can be uploaded again as long as the 24-hour expiration hasn't lapsed on the original upload request and as long as the final completion step hasn't been executed.

##### Response

A response code of 200 indicates that the part was submitted successfully. Any other status should be accompanied by a descriptive error for why it failed. Generally, requests in the 4xx code range are fatal errors that require a new media request, whereas 5xx failures are temporary and can be retried with an exponential back-off retry policy.

This API endpoint has no payload response when it succeeds.

##### Example Request(s)

```text
  curl -s -X POST \
    --form "media=@$MEDIA_DIR/$MEDIA_FILE_PART_2" \
    https://api.sproutsocial.com/v1/$CUSTOMER/media/submission/$SUBMISSIONID/part/2 \
    -H "authorization: Bearer $TOKEN" \
    -H "Content-Type: multipart/form-data"
```

```text
  curl -s -X POST \
    --form "media=@$MEDIA_DIR/$MEDIA_FILE_PART_3" \
    https://api.sproutsocial.com/v1/$CUSTOMER/media/submission/$SUBMISSIONID/part/3 \
    -H "authorization: Bearer $TOKEN" \
    -H "Content-Type: multipart/form-data"
```

Response:

A response code of 200 indicates that the part was submitted successfully. Any other status should be accompanied by a
descriptive error for why it failed.

```
(no body response)
```

#### Complete multipart media upload

```
GET /v1/<customer ID>/media/submission/<submission_id>
```

##### Response

A response code of 200 or 202 indicates that the request was good. Any other status should be accompanied by a
descriptive error for why it failed. Generally, requests in the 4xx code range are fatal errors that require a new media
request, whereas 5xx failures are temporary and can be retried with an exponential back-off retry policy.

##### Example Request (Not ready)

```text
  curl -s -X GET \
    https://api.sproutsocial.com/v1/$CUSTOMER/media/submission/$SUBMISSIONID \
    -H "authorization: Bearer $TOKEN"
```

Response:

HTTP Status 202 indicates that the request is good, but the media is not ready to be served yet. This process can take
seconds to minutes depending on the size of the content and if it was a link download or direct upload. If you receive
this response, please defer retrying the request until the `wait_until` time has lapsed. If a high number of calls occur
in a short duration, the requests could be rate limited and further complicate the processing of this request.

```json
{
   "data": [\
     {\
       "submission_id": "febca520-f44e-4b7c-b451-04a911c53f0f",\
       "wait_until": "2024-04-22T17:03:21.600802351Z"\
     }\
   ]
}
```

##### Example Request (ready)

HTTP Status 200 indicates that the request succeeded and that the `media_id` returned in the response body is now good
to use in other subsequent API requests.

Response:

```json
{
  "data": [\
    {\
      "media_id": "565fc90f-dd98-4c84-ab17-6f051fb536ce",\
      "expiration_time": "2023-10-12T11:20:16Z"\
    }\
  ]
}
```

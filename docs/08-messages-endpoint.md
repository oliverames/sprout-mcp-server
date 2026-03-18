# Messages Endpoint

> Source: [https://api.sproutsocial.com/docs/#messages-endpoint](https://api.sproutsocial.com/docs/#messages-endpoint)

```
POST /v1/<customer ID>/messages
```

The messages endpoint provides detailed data and metadata about your Sprout messages.

### Requests - Messages Endpoint

The request body for a Messages request is a JSON object with the following name/values pairs:

| Key | Description | Example |
| --- | --- | --- |
| `filters` | Refer to the [Request Filters](https://api.sproutsocial.com/docs/#request-filters---messages-endpoint) section below for details | `["group_id.eq(78910)", "customer_profile_id.eq(1234, 5678)", "created_time.in(2022-01-01..2022-02-01)"]` |
| `fields`<br>_(optional)_ | List of fields to return in results. If omitted, only the `guid` field is returned. Refer to the [Message Fields section](https://api.sproutsocial.com/docs/#message-fields) for full list of valid fields | `["post_type", "created_time", "from.name", "text"]` |
| `limit`<br>_(optional)_ | Specifies the max number of results per page in the response<br>Default: 50, Max: 100 | `10` |
| `timezone`<br>_(optional)_ | Time zone — from the [ICANN time zone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) — used for period values | `"America/Chicago"` |
| `page_cursor`<br>_(optional)_ | In paginated results, specifies the next page of data to return. Pagination for the messages endpoint only supports fetching the 'next' page of data. See [Messages Request Limits & Pagination](https://api.sproutsocial.com/docs/#messages-request-limits--pagination) section for details | `"page_cursor": "abc123=="` |
| `sort`<br>_(optional)_ | Return results sorted by message `created_time`<br> Default: descending | `["created_time:asc"]` |

#### Request Filters - Messages Endpoint

All requests to the Messages Endpoint require a `filter` parameter; the following table details the available `filter` options, which includes both required and optional filters:

| Filter Name | Description | Example Values |
| --- | --- | --- |
| `group_id` | No more than one Group Id to retrieve messages for; selecting `inbox_permalink` is not supported if group\_id isn't specified | `"group_id.eq(78910)"` |
| `customer_profile_id` | One or more Profile ids to retrieve messages for; these profiles must all belong to the requested `group_id` | `"customer_profile_id.eq(1234, 5678)"` |
| `message_id`<br>_(mutually exclusive)_ | One or more message GUIDs to retrieve; Must be used exclusively of all other filters | `"message_id.eq(t:1234, p:5678)"` |
| `created_time` | Only return messages having a `created_time` within the provided date range; accepts either `dates` or `datetimes`. Dates without timestamps are interpreted as midnight of that date, i.e. 2022-06-09 is treated as 2022-06-09T00:00:00 | `"created_time.in(2022-01-01...2022-02-01)"` |
| `action_last_update_time`<br>_(optional)_ | Only return messages which have a Sprout action (Reply, Tag, Like or Complete) having an `action_time` within the provided date range; accepts either `dates` or `datetimes`. Dates without timestamps are interpreted as midnight of that date, i.e. 2022-06-09 is treated as 2022-06-09T00:00:00. This range cannot be chronologically before the `created_time` range | `"action_last_update_time.in(2022-01-01...2022-02-01)"` |
| `post_type`<br>_(optional)_ | If provided, only messages of this type will be returned; defaults to all message types if omitted. Refer to the [Post Types table](https://api.sproutsocial.com/docs/#post-types) for full list of valid post\_types available for filtering | `"post_type.eq(TWITTER_DIRECT_MESSAGE, INSTAGRAM_MEDIA)"` |
| `tag_id`<br>_(optional)_ | If provided, only return messages with the specified `tag_ids` | `"tag_id.eq(123, 456, 789)"` |
| `language_code`<br>_(optional)_ | If provided, only return messages with the specified `language_codes` | `"language_code.eq(en, es, fr)"` |
| `from.guid`<br>_(optional)_ | One or more sender/external profile GUIDs to filter messages by the message author. Useful for narrowing results to messages from a specific profile or channel (for example `ytpr:1234`). | `"from.guid.eq(ytpr:1234)"` |

#### Request Body - Messages Endpoint

Example request:

```
{
  "filters": [\
    "group_id.eq(12345)",\
    "customer_profile_id.eq(1234, 5678, 9012)",\
    "created_time.in(2020-04-06T00:00:00..2020-04-19T23:59:59)",\
    "action_last_update_time.in(2020-08-06T00:00:00..2021-02-28T23:59:59)",\
    "post_type.eq(TWEET,FACEBOOK_POST,INSTAGRAM_DIRECT_MESSAGE)"\
  ],
  "fields": [\
    "network",\
    "activity_metadata.first_like.time_elapsed",\
    "created_time",\
    "post_category",\
    "post_type",\
    "perma_link",\
    "text",\
    "from",\
    "profile_guid",\
    "internal.tags.id",\
    "internal.sent_by.id",\
    "internal.sent_by.email"\
  ],
  "sort": ["created_time:desc"],
  "limit": 50,
  "timezone": "America/Chicago",
  "page_cursor": "123abc=="
}
```

### Responses - Messages Endpoint

Responses follow the standard Sprout API response format:

`data`

This array contains the message's data requested in JSON format.

`paging` _(optional)_

This object, if present, indicates there are still more pages of data to be fetched, and provides a cursor pointing to the next page of data:

| Key | Description | Example Value |
| --- | --- | --- |
| `next_cursor` | String of alphanumeric characters representing the next page of data, sorted by message `created_time` | `"abcd1234=="` |

#### Messages Request Limits & Pagination

- `message_id` (filters): maximum of 100 messages per request

- Pagination of response is based on the following request params:
  - `limit` \- number of messages returned per response (max: 100, default: 50)
  - `sort` \- sort order of messages in response; sorted by message `created_time` (default: desc)
- To paginate results: continuously fetch the "next" page of data, by updating the `page_cursor` parameter, until a response without a `paging` object is returned

- **Note: Unlike some other Sprout API Endpoints, index-based paging (e.g. `page: 4`) is not supported by the Messages Endpoint. While you can specify the `sort` direction,**
**you can only ever get the "next" page of data — you can't fetch the "previous" page**

- A Request containing an invalid `page_cursor` will return a HTTP 400 Bad Request response with a message describing the error


#### Response Data - Messages Endpoint

Example response:

```
{
  "data": [\
    {\
      "post_category": "POST",\
      "post_type": "INSTAGRAM_MEDIA",\
      "profile_guid": "placeholder",\
      "text": "placeholder",\
      "perma_link": "link here",\
      "network": "INSTAGRAM",\
      "internal": {\
        "tags": [\
          {\
            "id": 1234\
          },\
          {\
            "id": 5678\
          }\
        ],\
        "sent_by": {\
          "id": 2066696,\
          "email": "___@sproutsocial.com",\
          "first_name": "placeholder",\
          "last_name": "placeholder"\
        }\
      },\
      "created_time": "2022-06-09T22:10:54Z"\
    },\
    ...\
  ],
  "paging": {
    "next_cursor": "456def=="
  }
}
```

### Limitations

**Network Limitations**

1. To comply with the legal and partnership terms of service from Yelp/Trustpilot/TripAdvisor/Glassdoor, we cannot provide their data via our Public API. You can continue to view and manage all your reviews from these networks directly within the Sprout app.
2. To comply with Google's terms of service, all data retrieved for Google My Business POST\_TYPES will be limited to the last 30 days.

**Direct Message Limitations**

1. The messages endpoint supports all direct message fields except media. Text and other metadata are retrievable. Media URLs returned for images or videos in DMs are nonfunctional.

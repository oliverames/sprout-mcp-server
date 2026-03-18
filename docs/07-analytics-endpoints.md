# Analytics Endpoints

> Source: [https://api.sproutsocial.com/docs/#analytics-endpoints](https://api.sproutsocial.com/docs/#analytics-endpoints)

Analytics endpoints are all HTTP POST endpoints. They provide access to your owned profile and post analytics data, including:

- Profile Analytics - profile activity broken down by day
- Post Analytics - message content, metadata and lifetime activity metrics

### Overview

All requests to and responses from Analytics API endpoints have a similar structure.

#### Requests - Analytics Endpoints

The request body for an analytics API request is a JSON object with the following name/values pairs:

| Key | Description | Example Value |
| --- | --- | --- |
| `filters` | Detailed filters used to filter the results by `customer_profile_id`, `reporting_period` (for Profile metrics) and message `created_time` (for Posts endpoint). | Profile Endpoint: `["customer_profile_id.eq(1234, 5678)", "reporting_period.in(2018-01-01...2018-02-01)"]`<br>Posts Endpoint: `["customer_profile_id.eq(1234, 5678)", "created_time.in(2018-01-01...2018-02-01)"]` |
| `metrics` | List of metrics to return in results; refer to the [metrics](https://api.sproutsocial.com/docs/#metrics-and-fields) section for post and profile metrics available for each social network type | `["impressions", "likes"]` |
| `page`<br>_(optional)_ | In paginated results, which 1-indexed page to return in the response. <br>Pagination is based on default limits of 1000 results for the Profiles endpoint and 50 results for the Posts endpoint | `3` |
| `limit`<br>_(optional)_ | Specifies the max number of results per page in the response. <br>Defaults to 1000 results for the Profiles endpoint and 50 results for the Posts endpoint. | `100` |
| `sort`<br>_(optional)_ | _(Posts endpoint only)_<br>Sets the sort order for results, specified as a list of fields and directions (`asc` or `desc`) in the format `<field>:<direction>`. | `["created_time:asc"]` |
| `timezone`<br>_(optional)_ | _(Posts endpoint only)_<br>Time zone—from the [ICANN time zone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Timezone arguments only impact date/time-related filters, responses are not impacted and are always in UTC for posts. | `"America/Chicago"` |
| `fields`<br>_(optional)_ | _(Posts endpoint only)_<br>List of fields to return in results; if omitted, only the `guid` field is returned. Refer to the [Message Fields section](https://api.sproutsocial.com/docs/#message-fields) for full list of valid fields | `["content_category", "created_time", "from.name"]` |

#### Responses - Analytics Endpoints

Responses follow the standard data API response format:

`data`

This array contains the analytics data requested. See specific endpoints for additional details.

`paging`

This object specifies the state of paging for this response:

| Key | Description | Example Value |
| --- | --- | --- |
| `current_page` | 1-indexed page number of the response | `3` |
| `total_pages` | Total number of pages for the request | `20` |

A `paging` object is always returned, including when the response contains all data in one page. You can rely on checking for `current_page = total_pages` in order to know when you are at the end of the paging sequence.

Requesting a page greater than total\_pages will return a HTTP 400 Bad Request response with a message describing the error.

### Limitations

Note the maximum response size is capped at 10,000 results. For example, if a request with 50 responses per page is made,
you will get at most 200 `total_pages` back. Anything beyond this 10,000 limit will be truncated as a performance guardrail.

To request data for responses with more than 10,000 results, use a cursor-based pagination approach following these steps:

1.) Prepare the API URL for the specific endpoint you want to retrieve data from.

2.) Define the request body by specifying the necessary parameters like limit, timezone, filters, fields, and metrics criteria.

3.) Set the appropriate headers, including any required authentication or session information.

4.) Set the "sort" field to organize the response data by "guid" in ascending order

5.) Send an initial request to the API endpoint to retrieve a batch of data, specifying a limit on the number of items to be returned per request (e.g. 100 items per request).

6.) Process the sorted response data and extract the last "guid" value from the response. This "guid" will be used as the cursor for the next request.

7.) Send a subsequent request to the API endpoint. We’ll filter for posts with a guid greater than the guid we saw in the previous step to fetch the next batch of data. This request should also specify the limit and any other necessary parameters. See below for an example request to see how this is done.

8.) Repeat steps 2-7 until there are no more GUID's left in the response. Each time you receive a response, extract the last "guid" value, and use it to filter posts with greater guids for the following requests.

9.) As you receive the paginated responses, you can store or process the data as needed.

**Initial Request:**

```
{
    "filters": [\
        "customer_profile_id.eq(123, 4567, 890)"\
    ],
    "fields": [\
        "guid"\
    ],
    "sort": [\
        "guid:asc"\
    ],
    "limit": 2
}
```

**Initial Response:**

```
{
    "data": [\
        {\
            "guid": "101"\
        },\
        {\
            "guid": "102"\
        }\
    ]
}
```

**Subsequent Request:**

```
{
    "filters": [\
        "guid.gt(102)",\
        "customer_profile_id.eq(123, 4567, 890)"\
    ],
    "fields": [\
        "guid"\
    ],
    "sort": [\
        "guid:asc"\
    ],
    "limit": 2
}
```

Note that the last guid from the initial response (102) was used as a filter for the subsequent response ( "guid.gt(102)"). Each request thereafter should continue to filter on the last guid from the previous response until no more guids are returned.

**Network Limitations**

1. To comply with the legal and partnership terms of service from Yelp/Trustpilot/TripAdvisor/Glassdoor, we cannot provide their data via our Public API. You can continue to view and manage all your reviews from these networks directly within the Sprout app.
2. To comply with Google's terms of service, all data retrieved for Google My Business POST\_TYPES will be limited to the last 30 days.

### Owned Profile Analytics Endpoint

```
POST /v1/<customer ID>/analytics/profiles
```

The profiles endpoint is used to query profile-level metrics for a given set of profiles.

#### Request Body - Owned Profile Analytics Endpoint

An example request:

```
{
  "filters": [\
    "customer_profile_id.eq(1234, 5678, 9012)",\
    "reporting_period.in(2018-08-01...2018-10-01)"\
  ],
  "metrics": [\
    "impressions",\
    "reactions"\
  ],
  "page": 1
}
```

#### Response Data - Owned Profile Analytics Endpoint

An example response:

```
{
  "data" : [\
      {\
        "dimensions": {\
          "reporting_period.by(day)": "2018-08-01",\
          "customer_profile_id": 1234\
        },\
        "metrics": {\
          "impressions": 3400,\
          "reactions": 12\
        }\
      },\
      {\
        "dimensions": {\
          "reporting_period.by(day)": "2018-08-01",\
          "customer_profile_id": 5678\
        },\
        "metrics": {\
          "impressions": 23423,\
          "reactions": 29\
        }\
      },\
      ...\
  ],
  "paging": {
    "current_page": 2,
    "total_pages": 3
  }
}
```

#### Profile Request Limits & Pagination

- **`customer_profile_id` (filters)**: maximum of 100 profiles per request
- **`reporting_period` (filters)**: maximum of 1 year per request
- **Pagination of response:** pagination is based on 1000 results per response

#### Profile Time Zone

Profile daily activity uses the time zone of the native network. These time zones are the same that are used by native networks when grouping profile level activity.

| Network | Timezone |
| --- | --- |
| X | UTC |
| Facebook | PST/PDT |
| Instagram | PST/PDT |
| LinkedIn | UTC |
| YouTube | PST/PDT |
| Pinterest | UTC |
| Tiktok | UTC |

### Post Analytics Endpoint

```
POST /v1/<customer ID>/analytics/posts
```

The posts content endpoint queries for individual sent posts based on a filter criteria.

#### Request Body - Post Analytics Endpoint

An example request:

```
{
  "fields": [\
    "created_time",\
    "perma_link",\
    "text",\
    "internal.tags.id",\
    "internal.sent_by.id",\
    "internal.sent_by.email",\
    "internal.sent_by.first_name",\
    "internal.sent_by.last_name"\
  ],
  "filters": [\
    "customer_profile_id.eq(1234, 5678, 9012)",\
    "created_time.in(2020-04-06T00:00:00..2020-04-19T23:59:59)"\
  ],
  "metrics": [\
    "lifetime.impressions",\
    "lifetime.reactions"\
  ],
  "timezone": "America/Chicago",
  "page": 1
}
```

#### Response Data - Post Analytics Endpoint

An example response:

```
{
  "data": [\
      {\
        "text": "Come by for a cold brew!",\
        "perma_link": "https://www.instagram.com/p/B-pIo1GFqyl/",\
        "metrics": {\
          "lifetime.impressions": 15,\
          "lifetime.reactions": 0\
        },\
        "created_time": "2020-04-06T14:27:03Z",\
        "internal": {\
          "tags": [\
            {"id": 111111},\
            {"id": 111112},\
            {"id": 111113}\
        ],\
        "sent_by": {\
          "id": 1155555,\
          "email": "sprout.user@sproutsocial.com",\
          "first_name": "Sprout",\
          "last_name": "User"\
        }\
      },\
      ...\
  ],
  "paging": {
    "current_page": 1,
    "total_pages": 3
  }
}
```

#### Post Request Limits & Pagination

- **`customer_profile_id` (filters)**: maximum of 100 profiles per request
- **Pagination of response:** pagination is based on 50 messages per response

# Listening Endpoints

> Source: [https://api.sproutsocial.com/docs/#listening-endpoints](https://api.sproutsocial.com/docs/#listening-endpoints)

Listening endpoints are all HTTP POST endpoints. They provide access to your Listening Topic data, including:

- Messages - Enables you to query for messages within a given Topic.
- Metrics - Aggregates data across the Topic.

### Overview

All requests to and responses from Listening API endpoints have a similar structure.

#### Requests - Listening Endpoints

The request body for a Listening API request is a JSON object with the following name/values pairs:

| Key | Description | Example Value |
| --- | --- | --- |
| `filters` | Detailed filters used to filter the results by message `created_time` and `network`. To learn more about advanced filters for Topics see the [Filters section](https://api.sproutsocial.com/docs/#filters---listening-endpoints). | `["created_time.in(2018-01-01...2018-02-01)"]` |
| `metrics` | List of metrics to return in results; refer to the [metrics](https://api.sproutsocial.com/docs/#metrics-and-fields) | `["impressions", "likes"]` |
| `fields` | List of fields to return in results; at least one field is required for Listening messages endpoint. Refer to the [Listening Message Fields section](https://api.sproutsocial.com/docs/#listening-message-fields) for full list of valid fields | `["content_category", "created_time", "from.name"]` |
| `page`<br>_(optional)_ | In paginated results, which 1-indexed page to return in the response. <br>Pagination is based on default limits of 50 results | `3` |
| `limit`<br>_(optional)_ | Specifies the max number of results per page in the response. Defaults to 50 results for the Listening endpoints. | `100` |
| `sort`<br>_(optional)_ | Sets the sort order for results, specified as a list of fields and directions (`asc` or `desc`) in the format `<field>:<direction>`. | `["created_time:asc"]` |
| `timezone`<br>_(optional)_ | Time zone—from the [ICANN time zone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Timezone arguments only impact date/time-related filters, responses are not impacted and are always in UTC for posts. | `"America/Chicago"` |
| `dimensions`<br>_(optional)_ | _(Topic Metrics endpoints only)_<br> Breaks down metrics into discrete buckets. See [Dimensions section](https://api.sproutsocial.com/docs/#dimensions---listening-endpoints) to learn what fields work with dimensions. | `["created_time.by(day)", "sentiment"]` |

##### Filters - Listening Endpoints

Filtering is a powerful query mechanism that allows you to isolate data within your Topics. You can combine most fields or metrics with the operators below to produce filter to specific data sets using the Topic Messages or Topic Metric endpoints.

| Operator | Description | Example Value |
| --- | --- | --- |
| `gt` | Greater than | `likes.gt(10)` |
| `gte` | Greater than or equal to | `engagement_total.gte(5)` |
| `lt` | Less than | `replies.lt(5)` |
| `lte` | Less than or equal to | `impressions.lte(1000)` |
| `in` | Specifies a range. A helper that circumvents needed to use a filter with both gt and lt. Using .. is inclusive of the end value while ... is not. Dates and timestamps are accepted. Dates without timestamps are interpreted as midnight of that date, i.e. 2022-06-09 is treated as 2022-06-09T00:00:00. | `created_time.in(2023-05-01…2023-06-01T23:59:59)` |
| `eq` | Equals a particular value. Can contain multiple comma separated values. If multiple values are provided, the filter returns data containing at least one value. | `network.eq(TWITTER,INSTAGRAM)` |
| `neq` | The opposite of eq. | `network.neq(FACEBOOK)` |
| `exists` | Either true or false. Filter finds (or not) messages that meet the criteria of having a value (or not). | `visual_media.exists(true)` |
| `match` | Performs a text search query on a specified field. Multiple comma terms can be provided using spaces, wrap phrases or multiple words in quotes. Messages must match all provided terms. If you want a message that matches any single term, place an OR between terms (e.g. blue OR red). | `text.match(blue OR red)`<br>`text.match(“the blue car”)`<br>`text.match(blue red green)` |

You can apply multiple filters where data must meet all requirements by adding filters to the filters array. An example request using multiple filters:

```
{
  "filters": [\
   "created_time.in(2022-11-28..2022-12-29T23:59:59)",\
   "text.match(blue car)",\
   "network.eq(INSTAGRAM,YOUTUBE,LINKEDIN,TUMBLR,WWW,TIKTOK,BLUESKY)"\
 ]
}
```

#### Responses - Listening Endpoints

Due to greater variability in response length, only the Messages endpoint supports paging.
The Metrics endpoint does not support paging, and returns all data in a single response.

Responses follow the standard data API response format:

`data`

This array contains the Listening data requested. See specific endpoints for additional details.

`paging`

This object specifies the state of paging for this response:

| Key | Description | Example Value |
| --- | --- | --- |
| `current_page` | 1-indexed page number of the response | `3` |
| `total_pages` | Total number of pages for the request | `20` |

A `paging` object is always returned, including when the response contains all data in one page. You can rely on checking for `current_page = total_pages` in order to know when you are at the end of the paging sequence.

Requesting a page greater than total\_pages will return a HTTP 400 Bad Request response with a message describing the error.

##### Dimensions - Listening Endpoints

Dimensions are a powerful tool that allow you to slice and bucket Topic metrics. The most common uses for dimensions would be generating metrics over time (e.g. a trend chart) or breaking down metrics by metadata such as sentiment score. The following Topic fields can be used as a dimension.

- created\_time.by(day)
- created\_time.by(month)
- visual\_media.media\_type
- distribution\_type
- network
- sentiment
- language
- explicit\_label
- location.city
- location.province
- location.country

Here is an example of multiple dimensions being used to create a trend chart of sentiment data over time:

```
{
  "filters": [\
  "created_time.in(2022-11-28..2022-11-30)",\
  "network.eq(INSTAGRAM,YOUTUBE,LINKEDIN,TUMBLR,WWW,TIKTOK)"\
  ],
  "metrics": [\
    "replies",\
    "shares_count",\
    "likes"\
  ],
  "dimensions": [\
    "created_time.by(day)",\
    "sentiment"\
  ],
  "timezone": "America/Chicago"
}
```

Here is a sample output of this query:

```
{
    "data": [\
        {\
            "dimensions": {\
                "created_time": "2022-11-30T00:00:00-06:00",\
                "sentiment": "positive"\
            },\
            "metrics": {\
                "replies": 29.0,\
                "shares_count": 5.0,\
                "likes": 557.0\
            }\
        },\
        {\
            "dimensions": {\
                "created_time": "2022-11-30T00:00:00-06:00",\
                "sentiment": "neutral"\
            },\
            "metrics": {\
                "replies": 17.0,\
                "shares_count": 5.0,\
                "likes": 354.0\
            }\
        },\
        {\
            "dimensions": {\
                "created_time": "2022-11-30T00:00:00-06:00",\
                "sentiment": "negative"\
            },\
            "metrics": {\
                "replies": 49.0,\
                "shares_count": 20.0,\
                "likes": 4725.0\
            }\
        }\
    ],
    "paging": {}
}
```

### Topic Messages Endpoint

```
POST /v1/<customer ID>/listening/topics/<topic id>/messages
```

The Topic messages endpoint enables you to query for messages within a given Topic. The returning data set is an array of matching messages and the requested metrics or fields for each. This endpoint is best used to extract raw messages for further processing or providing sample messages within dashboards.

#### Request Body - Topic Messages Endpoint

An example request:

```
{
  "filters": [\
    "created_time.in(2022-11-28..2022-12-29T23:59:59)",\
    "explicit_label.exists(false), explicit_label.eq(false)",\
    "network.eq(INSTAGRAM,YOUTUBE,LINKEDIN,TUMBLR,WWW,TIKTOK)"\
  ],
  "fields": [\
    "content_category",\
    "created_time",\
    "hashtags",\
    "language",\
    "location.city"\
  ],
  "metrics": [\
    "engagements",\
    "from.followers_count",\
    "likes",\
    "replies",\
    "shares_count",\
    "authors_count",\
    "positive_sentiments_count",\
    "neutral_sentiments_count",\
    "negative_sentiments_count"\
  ],
  "sort": [\
    "created_time:desc"\
  ],
  "timezone": "America/Chicago",
  "limit": 50,
  "page": 1
}
```

#### Response Data - Topic Messages Endpoint

An example response:

```
{
    "data": [\
        {\
            "content_category": "PHOTO",\
            "guid": "17920699361640551",\
            "text": "Late post from Seattle trip \nColder than a blizzard in Alaska\n#seattle #seattlewashington #stevenspass #mtbakersnoqualmienationalforest #mtbaker #snoqualmiepass #snoqualmienationalforest #pikeplacemarket #pikeplace #seattlespaceneedle",\
            "perma_link": "https://www.instagram.com/p/CmxucH6L7T1/",\
            "network": "INSTAGRAM",\
            "visual_media": [\
                {\
                    "media_url": "https://scontent-iad3-1.cdninstagram.com/v/t51.29350-15/323197452_926427338517295_6369335809654161527_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=y4k7DO4QBHAAX8M7OZ1&_nc_ht=scontent-iad3-1.cdninstagram.com&edm=APCawUEEAAAA&oh=00_AfCps_5bFDmdZE-YVPDwVn5WF3XFWK4PWhd4-uRNTU2iCg&oe=643BF019",\
                    "media_type": "PHOTO"\
                },\
                {\
                    "media_url": "https://scontent-iad3-1.cdninstagram.com/v/t51.29350-15/322406676_8455452681195785_5328220517853332026_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=VpBu3GAXQqoAX_K5LU3&_nc_ht=scontent-iad3-1.cdninstagram.com&edm=APCawUEEAAAA&oh=00_AfD4SCutTw_J7hPbzUJNpAEyaoXd6kBmzHJM-MINZapJmg&oe=643CCB3C",\
                    "media_type": "PHOTO"\
                },\
                {\
                    "media_url": "https://scontent-iad3-1.cdninstagram.com/v/t51.29350-15/322520040_494039015961334_6394396172311331958_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=t6xksNZv91kAX9rE5mL&_nc_ht=scontent-iad3-1.cdninstagram.com&edm=APCawUEEAAAA&oh=00_AfBgn_HEqLsn269mk4oAFXQmbSrbRbxzpbrfwXZLg2F2YQ&oe=643BA80B",\
                    "media_type": "PHOTO"\
                },\
                {\
                    "media_url": "https://scontent-iad3-2.cdninstagram.com/v/t51.29350-15/322386857_955848772063194_984682163981872244_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=zIh0QFX3T50AX95k8wg&_nc_ht=scontent-iad3-2.cdninstagram.com&edm=APCawUEEAAAA&oh=00_AfB7_8ChB-7nq4MXdOaIatp0sCw4ZXqEOoikh-cCoEUIGA&oe=643BE125",\
                    "media_type": "PHOTO"\
                },\
                {\
                    "media_url": "https://scontent-iad3-1.cdninstagram.com/v/t51.29350-15/322393885_1262531494303623_5396853589364944362_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=uzwo3FqbohgAX_wtdqq&_nc_ht=scontent-iad3-1.cdninstagram.com&edm=APCawUEEAAAA&oh=00_AfAZmRdk8Va92UX3FmnjMJo_wf2rxwP5E_5ExT4-TWSSpA&oe=643BD1F1",\
                    "media_type": "PHOTO"\
                },\
                {\
                    "media_url": "https://scontent-iad3-1.cdninstagram.com/v/t51.29350-15/322830314_217584514039146_7428674933900498885_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=m2PtitrP1A0AX8f6gso&_nc_ht=scontent-iad3-1.cdninstagram.com&edm=APCawUEEAAAA&oh=00_AfD6KYXBQVk_BNNQ0FUM8NihyH08v7QF_t61BY3mFdu7sA&oe=643B60F6",\
                    "media_type": "PHOTO"\
                },\
                {\
                    "media_url": "https://scontent-iad3-2.cdninstagram.com/v/t51.29350-15/322294142_738549953871939_8482926741552785486_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=k8lcfSt9dhMAX_FZEyt&_nc_ht=scontent-iad3-2.cdninstagram.com&edm=APCawUEEAAAA&oh=00_AfAQYi1Lx_i-c-SRkWt6tfuhptuuvFx2PlBN1b6fb7kFGA&oe=643CA58A",\
                    "media_type": "PHOTO"\
                },\
                {\
                    "media_url": "https://scontent-iad3-1.cdninstagram.com/v/t51.29350-15/322601354_1215109445751814_6654433182308805760_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=8ae9d6&_nc_ohc=XsbPztVyu-4AX8vsyjC&_nc_ht=scontent-iad3-1.cdninstagram.com&edm=APCawUEEAAAA&oh=00_AfBdQ9GECTdbNtQ-06ruuXQVsN5qPrwKnGsghbaj8uPjig&oe=643B6CDE",\
                    "media_type": "PHOTO"\
                }\
            ],\
            "hashtags": [\
                "seattlespaceneedle",\
                "snoqualmienationalforest",\
                "seattle",\
                "stevenspass",\
                "pikeplace",\
                "seattlewashington",\
                "mtbakersnoqualmienationalforest",\
                "mtbaker",\
                "pikeplacemarket",\
                "snoqualmiepass"\
            ],\
            "created_time": "2022-12-30T03:27:02Z",\
            "listening_metadata": {\
                "sentiment": "neutral",\
                "explicit_label": false,\
                "language": "en"\
            }\
        }\
    ],
    "paging": {
        "current_page": 1
    }
}
```

#### Listening Messages Request Limits and Pagination

- Pagination of response is based on the following request params:
  - `limit` \- number of messages returned per response (max: 100, default: 50)
  - `sort` \- sort order of messages in response; sorted by message `created_time` (default: desc)

### Topic Metrics Endpoint

```
POST /v1/<customer ID>/listening/topics/<topic id>/metrics
```

The Topic metrics endpoint aggregates data across the Topic. Use this endpoint when you need answers related to key metrics such as total Topic volume, engagement, etc. or trends over time. This endpoint is best for quick insights or building complex dashboards.

#### Request Body - Topic Metrics Endpoint

An example request:

```
{
  "filters": [\
    "created_time.in(2022-11-28..2022-12-29T23:59:59)",\
    "network.eq(INSTAGRAM,YOUTUBE,LINKEDIN,TUMBLR,WWW,TIKTOK)",\
    "sentiment.eq(positive,negative,neutral,unclassified)"\
  ],
  "metrics": [\
    "replies",\
    "shares_count",\
    "likes"\
  ],
  "dimensions": [\
    "sentiment"\
  ],
  "timezone": "America/Chicago"
}
```

#### Response Data - Topic Metrics Endpoint

An example response:

```
{
 "data": [\
   {\
     "dimensions": {\
       "sentiment": "POSITIVE"\
     },\
     "metrics": {\
       "replies": 178563.0,\
       "shares_count": 55535.0,\
       "likes": 7221913.0\
     }\
   },\
   {\
     "dimensions": {\
       "sentiment": "NEGATIVE"\
     },\
     "metrics": {\
       "replies": 38758.0,\
       "shares_count": 43396.0,\
       "likes": 468540.0\
     }\
   },\
   {\
     "dimensions": {\
       "sentiment": "NEUTRAL"\
     },\
     "metrics": {\
       "replies": 14252.0,\
       "shares_count": 25529.0,\
       "likes": 807694.0\
     }\
   },\
   {\
     "dimensions": {\
       "sentiment": "UNCLASSIFIED"\
     },\
     "metrics": {\
       "replies": 31900.0,\
       "shares_count": 17977.0,\
       "likes": 1074959.0\
     }\
   }\
 ]
}
```

#### Listening Metrics Request Limits and Sorting

- Response length is based on the following request params:
  - `limit` \- number of metrics objects returned per response

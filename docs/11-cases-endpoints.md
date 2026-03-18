# Cases Endpoints

> Source: [https://api.sproutsocial.com/docs/#cases-endpoints](https://api.sproutsocial.com/docs/#cases-endpoints)

### Request - Filter Cases

```
POST /v1/<customer ID>/cases/filter
```

This endpoint provides information about your Sprout cases.

### Requests - Cases Endpoint

The request body for a Cases request is a JSON object with the following name/values pairs

| Key | Description | Example |
| :-- | :-- | :-- |
| `filters` | Refer to the Request Filters section below for details | `["updated_time.in(2025-01-01...2025-01-08)", "priority.eq(HIGH, LOW, UNDEFINED)"]` |
| `limit` _(optional)_ | Specifies the max number of results per page in the response Default: 50 Max: 100 | `10` |
| `timezone` _(optional)_ | Time zone — from the [ICANN time zone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) — used for period values Default: `"America/Chicago"` | `"America/Chicago"` |
| `page_cursor` _(optional)_ | In paginated results, specifies the next page of data to return. Pagination for the cases endpoint only supports fetching the 'next' page of data. See Cases Request Limits & Pagination section for details | `"page_cursor": "abc123=="` |
| `sort` _(optional)_ | Return results sorted by case `created_time or updated_time` Default: created\_time: descending | `["created_time:asc"]` |

#### Request Filters - Cases Endpoint

All requests to the Cases Endpoint require at least one `filter` parameter: either a **case\_id and no other filters** or **at least one date filter** with a maximum range of one-week. The following table details the available `filter` options, which include both required and optional filters:

| Filter Name | Description | Example Values |
| :-- | :-- | :-- |
| `case_id` (mutually exclusive) | Only return cases with these case ids. Must be used exclusively of all other filters. | `case_id.eq(23, 42)` |
| `created_time`\\* (optional) | Only return cases having a created\_time within the provided date range (up to one week); accepts either dates or datetimes. Dates without timestamps are interpreted as midnight of that date, i.e. 2025-01-01 is treated as 2025-01-01T00:00:00 | `created_time.in(2025-01-01...2025-01-08)` |
| `latest_activity_time* (optional)` | Only return cases that have their latest activity (case updates, internal comments, and social messages) within the provided date range (up to one week). Accepts either dates or datetimes. Dates without timestamps are interpreted as midnight of that date, i.e. 2025-01-01 is treated as 2025-01-01T00:00:00. This range cannot be chronologically before the created\_time range. | `latest_activity_time.in(2025-01-01...2025-01-08)` |
| `updated_time`\\* (optional) | Only return cases that have had their metadata updated (i.e. assignee, status, etc) within the provided date range (up to one week). This does not factor in new messages received or internal comments added to the case. See `latest_activity_time.` Accepts either dates or datetimes. Dates without timestamps are interpreted as midnight of that date, i.e. 2025-01-01 is treated as 2025-01-01T00:00:00. This range cannot be chronologically before the created\_time range. | `updated_time.in(2025-01-01...2025-01-08)` |
| `queue_id` (optional) | Only cases routed to specified queue will be returned; defaults to any queue assignment if omitted. | `queue_id.eq(23)` |
| `type` (optional) | Only cases of this type will be returned; defaults to all types if omitted. Valid Types: GENERAL, SUPPORT, LEAD, QUESTION, FEEDBACK | `type.eq(GENERAL, SUPPORT, LEAD, QUESTION, FEEDBACK)` |
| `priority` (optional) | If provided, only cases of this priority will be returned; defaults to all priorities if omitted. Valid Priorities: HIGH, LOW, CRITICAL, MEDIUM, UNDEFINED | `priority.eq(HIGH, LOW, CRITICAL, MEDIUM, UNDEFINED)` |
| `status` (optional) | Only cases of this status will be returned; defaults to all statuses if omitted. Valid Statuses: OPEN, ON\_HOLD, CLOSED | `status.eq(OPEN, ON_HOLD, CLOSED)` |
| `message_id` (optional) | Only cases related to these message guids, will be returned; defaults to all messages if omitted. \*when using the messages endpoint to retrieve the message, make sure you have signed the agreement with X or X message guids will not be returnable | `message_id.eq(igdm:aWdddfZAG1faXRlbToxOklHTWVz)` |
| `tag_id` (optional) | Only cases related with the tags ids will be returned; defaults to any tags if omitted. | `tag_id.eq(123,633,103) tag_id.neq(123,431,103)` |
| `assigned_by` (optional) | Only cases assigned by these urns will be returned; defaults to any assigner if omitted. | `assigned_by.eq(urn:spt:core:account_login:1420065, urn:spt:core:automated_rule:12345)` |
| `created_by` (optional) | Only cases created by these urns will be returned; defaults to any created\_by if omitted. | `created_by.eq(urn:spt:core:accont_login:8989, urn:spt:core:automated_rule:12345)` |
| `assigned_to` (optional) | Only cases assigned to these urns will be returned; defaults to all assignees if omitted. | `assigned_to.eq(urn:spt:core:account_login:1420065)` |

#### Request Body - Cases Endpoint

Example request:

```
{
  "filters": [\
    "created_by.eq(urn:spt:core:account_login:89829)",\
    "created_time.in(2025-02-06T00:00:00..2020-02-12T23:59:59)",\
    "updated_time.in(2025-02-10...2025-02-13)",\
    "priority.eq(HIGH, LOW, UNDEFINED)",\
    "status.eq(OPEN, IN_PROGRESS, ON_HOLD, CLOSED)",\
    "assigned_to.eq(urn:spt:core:account_login:1420065)",\
    "type.eq(general, support, lead, question, feedback)",\
    "queue_id.eq(23234)",\
    "message_id.eq(igdm:aWdddfZAG1faXRlbToxOklHTWVz)"\
  ],
  "sort": [\
    "created_time:desc"\
  ],
  "limit": 50,
  "timezone": "America/Chicago",
  "page_cursor": "123abc=="
}
```

Example request for cases by ID:

```
{
  "filters": [\
    "case_id.eq(123,456,789)"\
  ],
  "sort": [\
    "created_time:desc"\
  ],
  "timezone": "America/Chicago",
  "page_cursor": "123abc=="
}
```

### Responses - Cases Endpoint

Responses follow the standard Sprout API response format:

`data`

This array contains the case's data requested in JSON format.

`Paging` _(optional)_

This object, if present, indicates there are still more pages of data to be fetched, and provides a cursor pointing to the next page of data:

| Key | Description | Example Value |
| :-- | :-- | :-- |
| `next_cursor` | String of alphanumeric characters representing the next page of data, sorted by case `created_time or updated time` | `"abcd1234=="` |

#### Cases Request Limits & Pagination

- `Case_id`(filters): maximum of 100 case id’s per request
- Pagination of response is based on the following request params:
  - `limit`\- number of cases returned per response (max: 100, default: 50)
  - `sort`\- sort order of cases in response; sorted by case `created_time, or updated_time` (default: created\_time: desc)
- To paginate results: continuously fetch the "next" page of data, by updating the `page_cursor` parameter, until a response without a `paging` object is returned
- **Note: Unlike some other Sprout API Endpoints, index-based paging (e.g. `page: 4`) is not supported by the Cases Endpoint. While you can specify the `sort` direction, you can only ever get the "next" page of data — you can't fetch the "previous" page**

#### Response Data - Cases Endpoint

Example response:

```
{
 "case_id": "19508937",
 "type": "general",
 "group_id": "1196505",
 "priority": "LOW"
 "status": "CLOSED",
 "messages" : {[\
    "guid": "d:1747273869747175550",\
    “msg_created_date”: "2024-06-09T22:10:54Z",\
    "case_message_direction": "RECEIVED",\
    "is_anchor": true\
 ]},
"created_by": "urn:spt:core:account_login:2372804",
"created_time": "2024-06-09T22:10:54Z",
"updated_time": "2024-08-09T22:10:54Z",
"last_closed_time": "2024-10-09T22:10:54Z",
"queue_id": "756",
"assigned_to": ["urn:spt:core:account_login:2372804"],
"assigned_by": "urn:spt:core:account_login:2372804",
"tags": {[\
  “tag_id”: 2323132\
  “updated_by”: "urn:spt:core:account_login:2372804"\
  “updated_time”: "2024-08-09T22:10:54Z"\
]}
}
```

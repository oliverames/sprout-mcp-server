# Sprout API Details

> Source: [https://api.sproutsocial.com/docs/#sprout-api-details](https://api.sproutsocial.com/docs/#sprout-api-details)

### API URL

```
https://api.sproutsocial.com
```

### Endpoints Overview

Sprout API endpoints are grouped into three collections:

1. **Customer Metadata Endpoints** \- Use these endpoints to obtain high-level information about your Sprout customer account and profiles you have access to; many of these endpoints provide data needed to make requests to other Sprout API endpoints.
2. **Analytics Endpoints** \- These endpoints provide information about your Sprout profiles, and posts.
3. **Listening Endpoints** \- These endpoints provide metrics and messages related to your Listening Topics.
4. **Messages Endpoint** \- This endpoint provides detailed data and metadata about your Sprout messages.
5. **Publishing Post Endpoints** \- These endpoints allow for creation and management of posts that will be published at a future time.
6. **Media Endpoints** \- These endpoints are used to upload media for use within the API.
7. **Cases Endpoint** \- These endpoints provide detailed data about your Sprout cases.

| Customer Metadata Endpoints | Description |
| --- | --- |
| `GET /v1/metadata/client` | Customer IDs and Names |
| `GET /v1/<customer ID>/metadata/customer` | Customer Profiles |
| `GET /v1/<customer ID>/metadata/customer/tags` | Customer Tags |
| `GET /v1/<customer ID>/metadata/customer/groups` | Customer Groups |
| `GET /v1/<customer ID>/metadata/customer/users` | Customer Users |
| `GET /v1/<customer ID>/metadata/customer/topics` | Customer Topics |
| `GET /v1/<customer ID>/metadata/customer/teams` | Customer Teams |
| `GET /v1/<customer ID>/metadata/customer/queues` | Customer Case Queues |

| Analytics Endpoints | Description |
| --- | --- |
| `POST /v1/<customer ID>/analytics/profiles` | Owned Profile Analytics |
| `POST /v1/<customer ID>/analytics/posts` | Post Analytics |

| Listening Endpoints | Description |
| --- | --- |
| `POST /v1/<customer ID>/listening/topics/<topic id>/messages` | Topic Messages |
| `POST /v1/<customer ID>/listening/topics/<topic id>/metrics` | Topic Metrics |

| Messages Endpoint | Description |
| --- | --- |
| `POST /v1/<customer ID>/messages` | Inbox Messages |

| Publishing Post Endpoints | Description |
| --- | --- |
| `POST /v1/<customer ID>/publishing/posts` | Create Publishing Post |
| `GET  /v1/<customer ID>/publishing/posts/<publishing_post_id>` | Retrieve Publishing Post |

| Media Upload Endpoints | Description |
| --- | --- |
| `POST /v1/<customer ID>/media/` | Upload Media in a single request < 50MB |
| `POST /v1/<customer ID>/media/submission` | Start multipart media upload |
| `POST /v1/<customer ID>/media/submission/<submission_id>/part/<part_number>` | Continue multipart media upload |
| `GET /v1/<customer ID>/media/submission/<submission_id>` | Complete multipart media upload |

| Cases Endpoints | Description |
| --- | --- |
| `POST /v1/<customer ID>/cases/filter` | Retrieve Cases |

### General API Structure

All endpoints use the following naming structure:

```
/<version>/<customer ID>/<endpoint path>
```

Where:

- **version** is the API major version number
- **customer ID** is your Sprout customer ID

### Versioning

The Sprout API is versioned using a `MAJOR.MINOR` version format.

You can specify only the major number in requests, but the full version is included in responses.

A major version represents a breaking change to the API, including updates to the syntax and semantics for making requests of the APIs and the syntax and semantics of the response of the API.

A minor version represents a backwards compatible change to the API, such as adding new metrics, new endpoints, metric updates, etc. Minor versions are reflected in documentation, but not the API URL itself. Due to the backwards compatibility of minor versions, you only need to specify the major version in the URL path.

### Rate Limits

You’re limited to the following number of requests:

- **60** requests per minute
- **250,000** requests per month

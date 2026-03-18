# Endpoints

> Source: [https://api.sproutsocial.com/docs/#endpoints](https://api.sproutsocial.com/docs/#endpoints)

### Requests

All requests have the following format:

#### Request Headers

| Type | Value |
| --- | --- |
| Authorization | Bearer <OAuth access token OR API token> |
| Accept | application/json |
| Content-Type | application/json |

Note that the Authorization header accepts both account-scoped and OAuth access tokens.

#### Request Body

The content body for all requests are JSON objects. Details of the structure of that JSON object depend on the endpoint.

### Responses

#### HTTP Status Codes

The following HTTP status codes returned with the response have the following meanings:

| Code | Meaning | Corrective Action |
| --- | --- | --- |
| 200 OK | Request was processed successfully. | None. You should be able to access the result of the request in the response body. |
| 202 Ready | Request was processed successfully but not ready for a proper answer. | Retry the request. If this code persists, contact support. |
| 400 Bad Request | The request is malformed and does not conform with the request bodies specified in this document. | Update the request body. |
| 401 Unauthorized | The request does not contain a valid access token or that access token has expired. | Reauthenticate and obtain a fresh token. |
| 403 Forbidden | The request is accessing customer or profile data that the client is not allowed access to. | Update the request body. |
| 404 Not Found | The client is requesting an endpoint that does not exist. | Check your endpoint, and use an existing endpoint. |
| 405 Method Not Allowed | The client is using an HTTP verb that is not appropriate. | Use the HTTP verb listed for the API endpoint you’re using, typically POST or GET. See the specific endpoint documentation for details. |
| 415 Unsupported Media Type | The client has submitted a request body that is not JSON or is requesting a response that is not JSON | Correct the Accept and Content-Type headers to use JSON. |
| 429 Too Many Requests | The client is making requests too quickly or has exhausted the allowed requests in a month. | Slow down your requests. |
| 500 Internal Server Error | The server had an issue processing the request. | Retry the request. If this code persists, contact support. |
| 503 Service Unavailable | The server is overloaded and cannot process the request. | Retry the request. If this code persists, contact support. |
| 504 Gateway Timeout | The server was unable to produce a result in time. | Retry the request. If this code persists, contact support or decrease the scope of the request (smaller date ranges, less profiles, etc.). |

#### Response Headers

The following headers are returned with each response:

| Header | Description | Sample Value |
| --- | --- | --- |
| X-Sprout-Request-ID | Randomly generated UUID to trace a client request and response. Returned to you for debugging. | bedc387d-9b99-42ae-9887-cc15f9885d47 |
| X-Sprout-API-Version | Major and minor version of the response | 1.1 |
| X-Sprout-Server-Version | Server version, including the major, minor, and build number. The major and minor version reflect the latest available version of the API. | 1.1.3018 |

#### Response Body

Responses from the data API are JSON objects with the following format:

| Key | Value |
| --- | --- |
| `data` | JSON array containing the results of the API request (JSON objects for each message, dimensioned data, etc.) |
| `paging` | Optional JSON object describing the status of paging the data returned in the response. |
| `error` | Optional JSON string containing an error message in the event there is an issue with the request. |

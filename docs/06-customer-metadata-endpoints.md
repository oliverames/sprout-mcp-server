# Customer Metadata Endpoints

> Source: [https://api.sproutsocial.com/docs/#customer-metadata-endpoints](https://api.sproutsocial.com/docs/#customer-metadata-endpoints)

Customer Metadata endpoints are all HTTP GET endpoints. Use these to obtain information about the customer and profiles you have access to.

### Client (Customer ID) Endpoint

```
GET /v1/metadata/client
```

This endpoint is used to obtain the customer IDs and names you have access to.

#### Request Body - Client (Customer ID) Endpoint

No request body is necessary for this request.

#### Response Data - Client (Customer ID) Endpoint

The data array contains JSON objects of customer IDs and names you have access to. For example:

```
{
  "data": [\
    {"customer_id": 687751, "name": "My Business"}\
  ]
}
```

### Customer Profiles Endpoint

```
GET /v1/<customer ID>/metadata/customer
```

This endpoint is used to obtain the list of customer profile IDs you have access to.

#### Request Body - Customer Profiles Endpoint

No request body is necessary for this request.

#### Response Data - Customer Profiles Endpoint

The data array contains an array of JSON objects describing the social network profiles that are available to that client. The JSON object contains:

| Key | Description | Example Value |
| --- | --- | --- |
| `customer_profile_id` | The customer profile ID used by Sprout to identify this social network profile. | `492` |
| `network_type` | The type of social network (X, Facebook, Instagram, etc.) | `twitter` |
| `name` | The human-facing name of the social network profile | `Sprout Social` |
| `native_name` | The user name, screen name, page URL, etc. the social network uses to identify a unique profile. | `sproutsocial` |
| `native_id` | The ID used by the social network to identify a unique profile. | `42793960` |
| `groups` | An array of group IDs this profile belongs to. | `[23598, 65245]` |
| `network_metadata` | (Optional) Additional metadata fields only available for a subset of profile types. `address` available for Google My Business, Yelp, Tripadvisor. `store_code` available for Google My Business and Facebook locations. |  |

An example response:

```
{
  "data": [\
      {\
        "customer_profile_id": 492,\
        "network_type": "twitter",\
        "name": "Sprout Social",\
        "native_name": "sproutsocial",\
        "native_id": "42793960",\
        "groups": [23598, 65245]\
      },\
      {\
        "customer_profile_id": 6810812,\
        "network_type": "google_my_business",\
        "name": "Store Location",\
        "native_name": null,\
        "native_id": "13955863841611236869",\
        "groups": [2449295],\
        "network_metadata": {\
          "store_code": "872-P",\
          "address": "1308 Centerville Rd, Wilmington, DE, 19808",\
        }\
      },\
      ...\
  ]
}
```

### Customer Tags Endpoint

```
GET /v1/<customer ID>/metadata/customer/tags
```

This endpoint is used to obtain the list of message tags you created in Sprout. The response includes all active and archived tags, regardless of when the tag was created. Previously deleted tags are permanently removed from Sprout and are not included.

#### Request Body - Customer Tags Endpoint

No request body is necessary for this request.

#### Response Data - Customer Tags Endpoint

The data array contains an array of JSON objects describing the tags that are available. This includes all tags in a single response. There is no limit or pagination in the response. The JSON object contains:

| Key | Description | Example Value |
| --- | --- | --- |
| `tag_id` | The ID used by Sprout to identify this message tag | `321` |
| `any_group` | Whether or not this tag is available in any customer group | `false` |
| `active` | Whether this tag is active (or archived) in Sprout Social | `true` |
| `text` | The text of the tag | `"Social Support"` |
| `type` | The type of the tag (`LABEL` or `CAMPAIGN`) | `"LABEL"` |
| `groups` | An array of the IDs of the groups this tag is available in | `[206063]` |

An example response:

```
{
  "data": [\
      {\
        "tag_id": 321,\
        "any_group": false,\
        "active": true,\
        "text": "Social Support",\
        "type": "LABEL",\
        "groups": [206063]\
      },\
      ...\
  ]
}
```

### Customer Groups Endpoint

```
GET /v1/<customer ID>/metadata/customer/groups
```

This endpoint is used to obtain the list of groups you created in Sprout.

#### Request Body - Customer Groups Endpoint

No request body is necessary for this request.

#### Response Data - Customer Groups Endpoint

The data array contains an array of JSON objects describing the groups that are available to you. The JSON object contains:

| Key | Description | Example Value |
| --- | --- | --- |
| `group_id` | The ID used by Sprout to identify this group | `1234` |
| `name` | The name of the group | `"Sprout Social Team"` |

An example response:

```
{
  "data": [\
      {\
        "group_id": 1234,\
        "name": "Sprout Social Team"\
      },\
      ...\
  ]
}
```

### Customer Users Endpoint

```
GET /v1/<customer ID>/metadata/customer/users
```

This endpoint is used to obtain the list of users that are active for your customer.

#### Request Body - Customer Groups Endpoint

No request body is necessary for this request.

#### Response Data - Customer Groups Endpoint

The data array contains an array of JSON objects describing the active users for your customer. The JSON object contains:

| Key | Description | Example Value |
| --- | --- | --- |
| `id` | The ID used by Sprout to identify this user | `1234` |
| `name` | The name of the user | `"John Doe"` |
| `email` | The email address of the user | `"johndoe@example.com"` |

An example response:

```
{
  "data": [\
      {\
        "id": 1234,\
        "name": "John Doe",\
        "email": "johndoe@example.com"\
      },\
      ...\
  ]
}
```

### Customer Topics Endpoint

```
GET /v1/<customer ID>/metadata/customer/topics
```

Utilize this endpoint to find all Topics associated with your customer id. Each Topic includes associated metadata such as themes and available date ranges.

#### Request Body - Customer Topics Endpoint

No request body is necessary for this request.

#### Response Data - Customer Topics Endpoint

The data array contains an array of JSON objects describing the Topics that are available to the client. The JSON object contains:

| Key | Description | Example Value |
| --- | --- | --- |
| `id` | An identifier for the Topic used to make calls for Topic data | `81391723128379` |
| `name` | The name of the Topic | `Sprout Social Brand` |
| `topic_type` | The Topic category | `BRAND_HEALTH` |
| `description` | A description given by the user when creating the Topic | `A Topic for the brand.` |
| `group_id` | The group the Topic belongs to | `123456789` |
| `theme_groups` | The list of themes belonging to the Topic. Themes are always grouped even when they may not appear that way in app. | `[{"name":"Complaints","themes":[{"id":"018085b6-1dc3-43eb-ab28-3c430c0d2412","name":"SlowLogin"}]}]` |
| `theme_groups.name` | The name of the theme group | `Complaints` |
| `theme_groups.themes` | The themes that belong to the group | `[{"id":"018085b6-1dc3-43eb-ab28-3c430c0d2412","name":"SlowLogin"}]` |
| `theme_groups.themes.id` | The unique ID of the theme | `018085b6-1dc3-43eb-ab28-3c430c0d2412` |
| `theme_groups.themes.name` | The name for the theme | `SlowLogin` |
| `availability_time` | A date representing how far back data is available for the Topic | `2020-11-17T09:32:00Z` |

An example response:

```
[\
 {\
   "id": "81391723128379",\
   "description": "",\
   "group_id": 1330748,\
   "theme_groups": [\
     {\
       "name": "Complaints",\
       "themes": [\
        {\
         "id": "018085b6-1dc3-43eb-ab28-3c430c0d2412",\
         "name": "Login Errors"\
        }\
       ],\
     }\
   ],\
   "availability_time": 1600895454244,\
   "topic_type": "INDUSTRY_INSIGHTS",\
   "name": "Sprout Social Brand"\
 }\
]
```

### Customer Teams Endpoint

```
GET /v1/<customer ID>/metadata/customer/teams
```

This endpoint is used to obtain the list of teams that are active for your customer.

#### Request Body - Customer Teams Endpoint

No request body is necessary for this request.

#### Response Data - Customer Teams Endpoint

The data array contains an array of JSON objects describing the active teams for your customer. The JSON object contains:

| Key | Description | Example Value |
| :-- | :-- | :-- |
| `id` | The ID used by Sprout to identify this team | `"1234"` |
| `name` | The name of the team | `"Pricing Team"` |
| `description` | The description of the team | `"Answers pricing questions"` |

An example response:

```
{
  "data": [\
    {\
      "id": "1234",\
      "name": "Pricing Team",\
      "description": "Answers pricing questions"\
    },\
    ...\
  ]
}
```

### Customer Case Queues Endpoint

```
GET /v1/<customer ID>/metadata/customer/queues
```

This endpoint is used to obtain the list of queues that are active for your customer.

#### Request Body - Customer Queues Endpoint

No request body is necessary for this request.

#### Response Data - Customer Queues Endpoint

The data array contains an array of JSON objects describing the active queues for your customer. The JSON object contains:

| Key | Description | Example Value |
| --- | --- | --- |
| `id` | The ID used by Sprout to identify this queue | `"5678"` |
| `name` | The name of the queue | `"Pricing Queue"` |
| `description` | The description of the queue | `"For streaming pricing questions"` |
| `associated_teams` | An array of the IDs of the teams this queue is associated with | `["1234"]` |

An example response:

```
{
  "data": [\
    {\
      "id": "1234",\
      "name": "Pricing Team",\
      "description": "Answers pricing questions",\
      "associated_teams": [\
        "1234"\
      ]\
    },\
    ...\
  ]
}
```

# Sprout Tableau Connector

> Source: [https://api.sproutsocial.com/docs/#sprout-tableau-connector](https://api.sproutsocial.com/docs/#sprout-tableau-connector)

### Available Data Overview

✅  The Tableau Connector uses the Sprout API to bring social data into Tableau. The metrics and data points pull directly from those available in the Sprout API. Of the data available via the Sprout API data, these tables are directly available in Tableau:

- ✅  **Owned Profile Data** \- This matches the data available in Sprout’s Profile Performance, X Profiles, Facebook Pages, Instagram Business Profiles, LinkedIn Pages, Pinterest Profiles, TikTok Profiles and YouTube Videos Report.
- ✅  **Post Data** \- This matches the data available in Sprout’s Post Performance Report.
- ✅  **Tag Data** \- This matches the tags represented in Sprout’s Tag Performance Report. Tag data can be combined with Post Data to fully analyze tagged posts.

🚫  The Sprout Tableau Connector does not currently include:

- 🚫  Messages data
- 🚫  Data Unsupported in Sprout API. For more details reference the [Available Data Overview](https://api.sproutsocial.com/docs/#available-data-overview) section of this doc.

### Access Requirements

In order to access the Sprout Tableau Connector users must:

1. Have access to the Sprout API and a valid API Key. For more details reference the [Creating an Access Token](https://api.sproutsocial.com/docs/#creating-an-access-token-as-an-account-owner) section of this doc
2. Have access to Tableau

### Connection Set Up

1. Open Tableau

2. Select **Data > New Data Source**

3. Select a Web Data Connector

4. Input Connector URL [https://api.sproutsocial.com/tableau/](https://api.sproutsocial.com/tableau/)

![Reference image: Tableau Web Data Connector setup](https://api.sproutsocial.com/docs/static/9c6fbe63f1ce59151ffac601ad37e382/c08bc/Tableau_WebDataConnector.png)

5. Paste in API Key, Chose Date Range, and Select "Connect".

![Reference image: Tableau API Key configuration](https://api.sproutsocial.com/docs/static/a421f8ec11391a46b69acb1e42404876/59415/Tableau_APIKey.png)

6. Select a Standard Connection (Post, Profile, Tag) or individual data tables

![Reference image: Tableau Connectors page](https://api.sproutsocial.com/docs/static/23579fc88fdde820a3551fe1f15fd8b1/78e79/Tableau_Connectors.png)


\*Note that the Tableau connector does not support IPv6. Please use IPv4, or enable IPv6<->IPv4 translation.

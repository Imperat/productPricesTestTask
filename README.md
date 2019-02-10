Productfeeds server
===================

Motivation
----------
This project aims to provide simple http server which can be configured to 
process external resources from shops and store prices of their products. Please, have a note, that
server ignore all products data except of their prices.

How to run the server
---------------------

To run the server you need to meet these pre-requirements:
- Installed Node.js platform
- Running Redis Server

It was tested in Linux environment with Node.js version 8.11.2, npm 5.6.0
If you already have installed Node.js and running Redis, you are almost ready to start service.

Update config file `./config/settings.yaml` according to your settings and install dependencies
by following command (in root of the project directory):

`# npm i` 

Run the server:

`# npm run start`

API
---
Service supports two endpoints. To get price of product of specific shop make HTTP GET request with query params
`shopname` and `product_id`. For example, if you configured service to run on the localhost at 8080 port:

`GET http://localhost:8080/shopname=bodfeld&product_id=13953285`

`200 OK { '13953285': '97.39 EUR' }`

If there is no data for that shop or product, server will answer with 404 code. For example:

`GET http://localhost:8080/shopname=foo&product_id=12`

`404 Not Found { 'error': 'Product Not Found', 'reason': 'There is no data for shop "foo" and product "12"' }`

If your make wrong request, I'll get according answer with 400 code:

`GET http://localhost:8080/shopname="bodfeld"`

`400 Bad Request { 'error': 'Bad Request', 'reason': 'Query Param "product_id' is required' }`

To update existing data you have to send POST HTTP request without any params. For example:

`POST http://localhost:8080/`

`202 Accepted  { "ok": true, "info": "Importing process is started" }`


Limitations
-----------

- Service will not be able to fetch existing data automatically after it will be started. If you run server with empty
Redis cache, you need to send POST request via API to import data.
- After you send POST request, you'll have response immediately. Because of process of importing data can take long time,
service answers you with 202 status code and don't provide guarantee that process is finishing now.
- Service don't perform any parsing and validation of price column itself. If in input docs price is presented with
currency label or sign - it'll be stored "as is".

Developer Notes
---------------

This project follows airbnb code style. If you are not familiar with it, check it [here](https://github.com/airbnb/javascript/)

To lint code, type the command:

`# npm run lint`

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

Developer Notes
---------------

Not Now

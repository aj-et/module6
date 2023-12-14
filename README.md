# Overview

This is a web application that I created for reserving a spot for the sommerset clubhouse, that my wife is a housing manager of.

To run the backend part, install the node_modules by navigating to the backend folder and enter `npm install` in the terminal. Create a .env file and fill up the required environment variables. You can then type npm start to run the backend part of the web app.

To run the frontend part, open another terminal and navigate to the frontend folder. In VS Code, you can install `live server` and run the html file or just open it with the browser.

The purpose of this web application project is to help both the housing manager and the tenant to set and view the available time and day for the clubhouse booking.

[Software Demo Video](http://youtube.link.goes.here)

# Web Pages

This web page is a one page only web app. The inputs are on the top and the calendar on the bottom. The user can see each booking made and they can only book on the time slots that are available.

# Development Environment

I mainly used the basic HTML, JavaScript, and CSS for the frontend.

I used node and JavaScript for my backend. The backend access all the packages and libraries needed to show the calendar and set the booking.

Libraries used:
* mongoose - to access mongoDB
* nodemailer - to send an email confirmation of the booking made.

# Useful Websites

* [Nodemailer docs](https://nodemailer.com/)
* [JavaScript docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

# Future Work

* Item 1 - Add a reCaptcha to prevent bot attacks.
* Item 2 - user verification (but that will require permission since I will have to use a database of the student's info)
* Item 3 - A better and more modern design for the web application.
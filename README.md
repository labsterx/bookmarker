Bookmarker
=========

Bookmarker is a web app to manage bookmarks. It allows users to create, add and manage bookmarks online.

This web app is built with the MEAN stack with AngularJS on the front-end and Node.js, Expree and MongoDB on the backend.

Setup
--------------

This web app uses mongodb to store data. You can use a free mongodb database from mongolab.com. Once you have setup your free mongodb database, you can either update the mongo_uri variable in the config file server/config/index.js or create an environment variable called "BOOKMARKER_MONGO_URI" to store your Mongodb URI. The Mongodb URI should look somthing like: "mongodb://abcdef:password@abc1234.mongolab.com:123456/bookmarkerdb".


Installation And Run
--------------

```sh

# Clone Repository
$ git clone git@github.com:labsterx/bookmarker.git
$ cd bookmarker
$ npm install
$ bower install
$ npm start

```

For logging in, use the username "test" and password "bookmarker".

Author
------

**LabsterX**

* Website: http://www.labsterx.com
* Twitter: https://twitter.com/labsterx
* Github: https://github.com/labsterx

License
----

This app is licensed under the MIT Open Source license. For more information, see the LICENSE file in this repository.
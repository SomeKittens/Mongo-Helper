Mongo Helper
===========
This is a simple wrapper created to make it easier for us to prototype systems quickly with minimal errors.  My priority here is to keep things simple, rather than giving the user a lot of options.

NOTE: Don't use this if you don't already know how to interact with MongoDB.  Using Mongo Helper is no excuse for not understanding the underlying code.

Installing
=========
You can either install it by adding the following dependency in `package.json`:

    "dependencies": {
      "mongo-helper": "0.1.x"
    }
    
and then running `npm install` or by running `npm install mongoHelper` in your project directory.

Usage
=====
Now that you've installed mongoHelper, how can you use it?

Sadly, Mongo Helper can't read your mind (yet), so you'll need to provide it with some parameters about your particular needs.  The simple way to require this is:

    var mongoHelper = new (require('mongo-helper'))({Parameters: 'here'});
    
It's also possible (and might work better, depending on your project) to define a `config` object and pass that:

    var mongoHelper = new (require('mongo-helper'))(config);
    
Mongo Helper takes the following parameters (if you don't include them, Mongo Helper will revert to a default value)

 - `serverAddress` - The IP/Address of the MongoDB server (default: `localhost`)
 - `serverPort` - Port used to connect to the mongoDB server (default: `mongo.Connection.DEFAULT_PORT`)
 - `serverOptions` - Options to pass to the server (in an object literal) (default: `{auto_reconnect: true}`)
   - You can find all possible options [at the docs](http://mongodb.github.com/node-mongodb-native/api-generated/server.html#constructor)
 - `dbName` - Name of the database you'll be using (default: `test`)
 - `dbOptions` - Options to pass to the db constructor (in an object literal) (default: `{safe: true}`)
   - [All possible options](http://mongodb.github.com/node-mongodb-native/api-generated/db.html#constructor)

###Insert
Insert takes three parameters: `coll`, `query`, and `next`.

 - `coll` is a string representing the collection we want to insert `query` into
 - `query` is the object to be inserted into the collection
 - `next` is a function that will be called after the db operations finish.  The database is closed before `next` is called, so you can call another db operation with `next`.
 
For example, if I wanted to insert `{foo: 'bar'}` into the `foobar` collection (and had required it like above, I would write:

    mongoHelper.insert('foobar', {foo: 'bar'});
    
If I then wanted to run `myFunc` after that:

    mongoHelper.insert('foobar', {foo: 'bar'}, myfunc);
    
###Find
Like insert, find takes three parameters.  The one change is that the results of the find statement will be passed to the function you input.

###Remove
The data removed is passed to `next`.

###Update
Update takes five parameters:

 - `coll` and `next` are the same, with the updated data being sent to `next`
 - `criteria` is the query that mongo will use to find the entries to update
 - `update` is the entry that will update the selected documents
 - `params` are the parameters you want to pass to `update`.  [Option values](http://mongodb.github.com/node-mongodb-native/markdown-docs/insert.html#update)

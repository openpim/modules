# AD (Active Directory) integration

## introduction

This is an AD integration example. This code allows you to authenticate users against AD (Active Directory)

## Delivery

This project generates js library (auth.js) that is using later at server for external authentication.
The build part of the project is based at [Start your own JavaScript library using webpack and ES6](http://krasimirtsonev.com/blog/article/javascript-library-starter-using-webpack-es6)

## How to build

run `npm run build` and you will have lib directory created with the file auth.js inside.

## How to deploy at server

Server is running under docker and it has the folder `filestorage` mapped to external directory.
You should create folder `modules` (under `filestorage`) and puth generated `auth.js` there.
Server will check the file `/filestorage/modules/auth.js` during start and if this file exists it will be loaded
and external authentication against AD will be enabled.

## How it is working

After deploy server will know that we have addition external authentication, so first server will check user against 
OpnPIM database during login. If such user is not found and external authentication is enabled server will try to
authenticate user by calling auth (login, password) function provided by external authentication.
See [the sources](./src/index.js).

If external authentication was successful (function auth return user details) then user will be created on the fly in the PIM database with the special mark
that this is external user.

Next time during login system will load the user by login from database, see that this is an external user and authenticate it again with the `auth` function.

## Sources and Configuration of index.js

The login of AD authentication in [auth function](./src/index.js) is easy:

1. First we open an connection with AD server
2. Second we try to perform a login with this user and password
3. If login was successful system load user details from AD and check if this user has necessary AD Group
4. If user has necessary group then the function return object with the user details
`{login: login, tenantId: 'default' , name: data.object.displayName, email: data.object.userPrincipalName, groups:DEFAULT_GROUPS}`
You can see that we return `groups` - array of PIM roles identifiers that will be assigned to the user during first login (user will be created automatically in PIM database at first login).
Then roles can be changed inside OpenPIM user interface.

You can see constants `LDAP_URL`, `USER_FULL_ID`, `PIM_GROUP` and `DEFAULT_GROUPS` at the beginning of the sources that should be modified according to your AD configuration





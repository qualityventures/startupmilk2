unchartd-landing
=====================

Unchartd landing

### Installing
```
npm i
npm i node-sass
cp src/data/config.default.js src/data/config.js
cp src/data/mongo.default.js src/data/mongo.js
cp src/data/jwt.default.js src/data/jwt.js
edit jwt.js config.js mongo.js
npm run cli init
```

### Creating admin user
```
npm run cli createAdminUser
```

### Building
```
npm run build
bundle files will appear in ./public/assets/
```

### Running webpack dev server
```
npm run dev-server
open http://localhost:3019
```

### Running dev SSR server
```
npm run nodemon
open http://localhost:3020
```

### Running prod SSR server
* `npm run server-start`  Start server
* `npm run server-restart` Restart server
* `npm run server-stop` Stop server
* `npm run server-delete` Delete server from pm2
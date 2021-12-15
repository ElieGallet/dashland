# Dashland
Towerfall ELO-based Leaderboards

### Node.js
```
npm run start
```

### Docker
```
 -  "docker build -t dashland-image ."
 -  "docker run --name dashland-container -d -p 3000:3000 dashland-image"
```

### Environement Variables:
 - `PORT`: Port to bind server to. (default: 3000)
 - `LOGFILE`: Path to the games log. (default: "./logs/redux.log")
 - `PASSWORD`: Password for adding games. (none by default)

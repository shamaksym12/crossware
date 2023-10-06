# Crossware web

## Install

1. .env config

Copy `frontend/.env.sample` and create `frontend/.env`.
Copy `backend/.env.sample` and create `backend/.env`.
Fill in the missing fields in each .env

2. Run services
```sh
docker compose up
```

3. Clone camera data
```sh
docker compose exec backend ./clone_camera_data.sh
# Please input SFTP password
```

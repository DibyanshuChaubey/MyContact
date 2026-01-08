# Contact Manager (Minimal)

Simple contact manager with a clean separation:
- Backend: Flask + SQLite + JWT
- Frontend: HTML/CSS/JS (vanilla)

## Run Backend
1) Install dependencies
```
pip install -r backend/requirements.txt
```
2) Start server
```
python backend/run.py
```
API base: http://localhost:5000/api

## Run Frontend
Open frontend/index.html in a browser. For a local server:
```
cd frontend
python -m http.server 8000
```
Then visit http://localhost:8000

## Docker (optional)
Build and run the backend:
```
docker compose up --build
```

That’s it. Keep it simple and tidy.

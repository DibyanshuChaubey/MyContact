FROM python:3.10-slim

WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code
COPY backend ./backend

EXPOSE 5000

ENV FLASK_ENV=production

CMD ["python", "backend/run.py"]

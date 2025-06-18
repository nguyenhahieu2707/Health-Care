FROM python:3.11

# Set working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Cài đặt dependencies cho mysqlclient
RUN apt-get update && \
    apt-get install -y default-libmysqlclient-dev build-essential && \
    pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

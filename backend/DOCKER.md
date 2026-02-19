# Docker Setup for PostgreSQL

This directory includes a Docker Compose setup for running PostgreSQL locally.

## Quick Start

### 1. Start PostgreSQL Container

```bash
docker-compose up -d
```

This will:
- Pull the PostgreSQL 14 Alpine image (if not already downloaded)
- Create a container named `interviewdock-postgres`
- Map port 5432 to your local machine
- Create a `postgres_data/` directory for persistent storage

### 2. Verify Container is Running

```bash
docker-compose ps
```

You should see:
```
NAME                 IMAGE               STATUS
prepeasy-postgres    postgres:14-alpine  Up (healthy)
```

### 3. Check Container Logs

```bash
docker-compose logs -f postgres
```

### 4. Start Backend Server

```bash
npm run dev
```

The backend will connect to the PostgreSQL container using the credentials in `.env`.

### 5. Seed the Database

```bash
npm run seed
```

## Container Management

### Stop the Container

```bash
docker-compose down
```

### Stop and Remove Data (⚠️ This will delete all data)

```bash
docker-compose down -v
rm -rf postgres_data
```

### Restart the Container

```bash
docker-compose restart
```

### View Logs

```bash
docker-compose logs -f postgres
```

## Connect to PostgreSQL CLI

```bash
docker-compose exec postgres psql -U postgres -d interviewdock
```

Or using psql on your host machine:

```bash
psql -h localhost -U postgres -d interviewdock
```

Password: `postgres`

## Environment Variables

The Docker Compose setup uses the following defaults:

- **POSTGRES_USER**: postgres
- **POSTGRES_PASSWORD**: postgres
- **POSTGRES_DB**: interviewdock
- **PORT**: 5432

Make sure your `.env` file matches these credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=interviewdock
```

## Data Persistence

- Database data is persisted in `./postgres_data/` directory
- This directory is git-ignored to avoid committing database files
- Data persists even when container is stopped
- To reset data, remove the `postgres_data/` directory

## Health Check

The container includes a health check that runs every 10 seconds:

```bash
docker-compose ps
```

The `STATUS` column will show `Up (healthy)` when PostgreSQL is ready.

## Troubleshooting

### Port Already in Use

If port 5432 is already in use:

1. Stop existing PostgreSQL service:
   ```bash
   # macOS
   brew services stop postgresql
   
   # Linux
   sudo systemctl stop postgresql
   ```

2. Or change the port in `docker-compose.yml`:
   ```yaml
   ports:
     - "5433:5432"  # Use port 5433 on host
   ```

   Then update `.env`:
   ```env
   DB_PORT=5433
   ```

### Container Won't Start

Check logs for errors:
```bash
docker-compose logs postgres
```

### Cannot Connect from Backend

1. Verify container is running:
   ```bash
   docker-compose ps
   ```

2. Check if port is accessible:
   ```bash
   nc -zv localhost 5432
   ```

3. Verify credentials in `.env` match `docker-compose.yml`

### Reset Everything

```bash
docker-compose down -v
rm -rf postgres_data
docker-compose up -d
npm run seed
```

## Production Note

This Docker setup is for **local development only**. For production:

- Use a managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
- Or set up proper security, backups, and monitoring
- Never use default credentials
- Use secrets management

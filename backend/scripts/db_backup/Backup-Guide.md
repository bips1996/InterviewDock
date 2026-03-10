# Database Backup Guide

Quick reference for backing up and restoring the InterviewDock PostgreSQL database.

## Quick Start

### Create a Backup
```bash
cd backend

# Development
./scripts/backup-db.sh

# Production
./scripts/backup-db.sh --prod
```

### List Backups
```bash
./scripts/list-backups.sh
./scripts/list-backups.sh --detailed    # With timestamps
```

### Restore a Backup
```bash
./scripts/restore-db.sh backups/interviewdock_backup_YYYYMMDD_HHMMSS.sql.gz
```

---

## Common Scenarios

**Before Deployment**
```bash
./scripts/backup-db.sh --prod
```

**After Failed Migration**
```bash
./scripts/list-backups.sh
./scripts/restore-db.sh backups/[latest-backup].sql.gz
```

**Daily Production Backup (Keep 30 days)**
```bash
./scripts/backup-db.sh --prod --keep 30
```

---

## Script Options

### backup-db.sh
```bash
./scripts/backup-db.sh [options]
```

| Option | Description |
|--------|-------------|
| `--prod` | Use production environment |
| `--no-compress` | Skip compression (faster, larger files) |
| `--keep N` | Keep last N backups (default: 7) |
| `--env FILE` | Use specific env file |
| `--help` | Show help |

### restore-db.sh
```bash
./scripts/restore-db.sh [options] <backup_file>
```

| Option | Description |
|--------|-------------|
| `--prod` | Use production environment |
| `-y, --yes` | Skip confirmation prompt |
| `--env FILE` | Use specific env file |
| `--help` | Show help |

### list-backups.sh
```bash
./scripts/list-backups.sh [options]
```

| Option | Description |
|--------|-------------|
| `-d, --detailed` | Show detailed info with dates |
| `--dir DIR` | Use custom backup directory |
| `--help` | Show help |

---

## Automated Backups

### Setup Daily Backup (2 AM)
```bash
crontab -e

# Add this line:
0 2 * * * cd /home/ec2-user/InterviewDock/backend && ./scripts/backup-db.sh --prod --keep 30 >> logs/backup.log 2>&1
```

### Other Schedules
```bash
# Every 6 hours
0 */6 * * * cd /home/ec2-user/InterviewDock/backend && ./scripts/backup-db.sh --prod

# Weekly (Sunday 3 AM)
0 3 * * 0 cd /home/ec2-user/InterviewDock/backend && ./scripts/backup-db.sh --prod --keep 12
```

### Verify Cron is Working
```bash
# Check backup logs
tail -f logs/backup.log

# List recent backups
./scripts/list-backups.sh
```

---

## Recommended Backup Schedule

| Environment | Frequency | Retention | Command |
|-------------|-----------|-----------|---------|
| Development | Daily | 7 days | `./scripts/backup-db.sh --keep 7` |
| Staging | Daily | 14 days | `./scripts/backup-db.sh --keep 14` |
| Production | Every 6 hours | 30 days | `./scripts/backup-db.sh --prod --keep 28` |

---

## Best Practices

**Always backup before:**
- Database migrations
- Production deployments
- Major updates
- Data imports

**Test restores regularly** - A backup is only good if you can restore it!

**Keep offsite backups** - Upload to S3, remote server, or cloud storage

**Monitor backup sizes** - Sudden changes may indicate issues

---

## Troubleshooting

### Container Not Running
```bash
docker-compose up -d
docker ps | grep postgres
```

### Check Container Logs
```bash
docker logs interviewdock-postgres --tail 50
```

### Verify Backup Integrity
```bash
gunzip -t backups/backup.sql.gz
```

### Permission Denied
```bash
chmod +x scripts/*.sh
```

### Check Disk Space
```bash
df -h
du -sh backups/
```

---

## Manual Commands

### Manual Backup
```bash
docker exec interviewdock-postgres pg_dump -U postgres -d interviewdock | gzip > backup.sql.gz
```

### Manual Restore
```bash
gunzip -c backup.sql.gz | docker exec -i interviewdock-postgres psql -U postgres -d interviewdock
```

### Check Database Size
```bash
docker exec interviewdock-postgres psql -U postgres -d interviewdock -c "SELECT pg_size_pretty(pg_database_size('interviewdock'));"
```

### List Tables
```bash
docker exec interviewdock-postgres psql -U postgres -d interviewdock -c "\dt"
```

---

## Backup Files

**Location**: `backend/backups/`  
**Format**: `interviewdock_backup_YYYYMMDD_HHMMSS.sql.gz`  
**Example**: `interviewdock_backup_20260310_143022.sql.gz`

---

## Security Notes

1. Backups contain sensitive data - protect them
2. Set appropriate permissions: `chmod 600 backups/*.sql.gz`
3. Use encrypted transfer for offsite backups
4. Don't share backups publicly

---

**Need more details?** Run any script with `--help` flag for full options.

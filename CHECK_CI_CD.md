# Check CI/CD Status

## How to Verify CI/CD is Working

### Step 1: Check GitHub Actions

1. Go to: https://github.com/harshava123/ser/actions
2. Look for the latest workflow run: "Deploy Backend to Server"
3. Check if it's:
   - ✅ **Green checkmark** = Success (deployed to server)
   - ⏳ **Yellow circle** = Running
   - ❌ **Red X** = Failed

### Step 2: Check Workflow Logs

Click on the latest workflow run to see:
- **Deploy to server** step - Should show Docker build and deployment
- **Verify deployment** step - Should show "✅ Backend container is running"

### Step 3: Verify on Server

SSH to your server and check:

```bash
cd /data/backend
git log --oneline -5
docker-compose ps
docker-compose logs --tail=20 backend
```

**Expected**:
- Latest commit should match your push
- Container should be running
- Logs should show "✅ Connected to MongoDB"

## CI/CD Configuration

The workflow now triggers on **ANY push to main branch** (no path restrictions).

**What happens when you push**:
1. GitHub Actions starts
2. SSH to server
3. `git pull origin main` (pulls latest code)
4. `docker-compose down` (stops old container)
5. `docker-compose build --no-cache` (rebuilds image)
6. `docker-compose up -d` (starts new container)
7. Health check verifies it's running

## Troubleshooting

### CI/CD Not Triggering
- Check: Is the workflow file in `.github/workflows/`?
- Check: Are you pushing to `main` branch?
- Check: GitHub Actions tab shows the workflow

### Deployment Failing
- Check: SSH key is set in GitHub Secrets (`SSH_PRIVATE_KEY`)
- Check: Server IP is correct (`SERVER_IP`)
- Check: Server user is correct (`SERVER_USER`)
- Check: Server has Docker and docker-compose installed

### Code Not Updating on Server
- Check: `git pull` is working on server
- Check: Docker container is rebuilding
- Check: Container logs show latest code


#!/bin/bash
echo "=== EC2 INSTANCE INFORMATION GATHERING ==="
echo "Timestamp: $(date)"
echo

echo "=== 1. SYSTEM & USER INFO ==="
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME)"
echo "User: $(whoami)"
echo "Current directory: $(pwd)"
echo "Home directory: $HOME"
echo

echo "=== 2. PROJECT STRUCTURE ==="
echo "Looking for project directories..."
find /home -name "*gait*" -o -name "*imppilot*" -type d 2>/dev/null
find /opt -name "*gait*" -o -name "*imppilot*" -type d 2>/dev/null
echo "Looking for package.json files..."
find /home -name "package.json" -type f 2>/dev/null
echo

echo "=== 3. NODE.JS & PM2 INFO ==="
echo "Node version: $(node --version 2>/dev/null || echo 'Node not found')"
echo "PM2 version: $(pm2 --version 2>/dev/null || echo 'PM2 not found')"
echo "PM2 processes:"
pm2 list 2>/dev/null || echo "PM2 not running"
echo

echo "=== 4. RUNNING PROCESSES & PORTS ==="
netstat -tlnp 2>/dev/null | grep LISTEN
echo

echo "=== 5. GIT REPOSITORIES ==="
for dir in /home /opt /var; do
    find "$dir" -name ".git" -type d 2>/dev/null | while read gitdir; do
        projectdir=$(dirname "$gitdir")
        echo "Git repo: $projectdir"
        cd "$projectdir"
        echo "  Branch: $(git branch --show-current 2>/dev/null)"
        echo "  Remote: $(git remote get-url origin 2>/dev/null)"
    done
done
echo

echo "=== 6. TESTING CONNECTIVITY ==="
curl -s --max-time 5 http://localhost:3000/health && echo "Health endpoint: OK" || echo "Health endpoint: FAILED"
echo

echo "=== COMPLETE ==="

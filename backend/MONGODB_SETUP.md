# MongoDB Setup Guide

## Issue: Connection Refused Error

If you're seeing `connect ECONNREFUSED ::1:27017`, it means MongoDB is not running or not accessible on your machine.

## Solution Options

### Option 1: Use MongoDB Atlas (Recommended - Easiest) ☁️

MongoDB Atlas is a free cloud-hosted MongoDB service. No installation required!

1. **Sign up for MongoDB Atlas:**
   - Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free account (M0 Free Tier)

2. **Create a Cluster:**
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Select a cloud provider and region
   - Give your cluster a name (e.g., "Portfolio")
   - Click "Create"

3. **Configure Database Access:**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password (save these!)
   - Set privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access:**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development) or add your IP
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority`)
   - Replace `<password>` with your actual password
   - Replace `<username>` with your actual username

6. **Update your `.env` file:**
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
   ```

7. **Restart your backend server:**
   ```bash
   npm run dev
   ```

---

### Option 2: Install MongoDB Locally 🖥️

#### For Windows:

1. **Download MongoDB Community Server:**
   - Go to [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Select Windows, MSI package
   - Download and run the installer

2. **Install MongoDB:**
   - Run the installer
   - Choose "Complete" installation
   - **Important:** Check "Install MongoDB as a Service"
   - Install MongoDB Compass (optional, GUI tool)

3. **Verify Installation:**
   - Open PowerShell as Administrator
   - Run: `Get-Service MongoDB`
   - Should show status as "Running"

4. **If MongoDB service is not running:**
   ```powershell
   # Start MongoDB service
   net start MongoDB
   
   # Or using PowerShell
   Start-Service MongoDB
   ```

5. **Verify your `.env` file has:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/portfolio
   ```

6. **Test connection:**
   ```bash
   npm run dev
   ```

#### For Mac/Linux:

```bash
# Install using Homebrew (Mac)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Or install using package manager (Linux)
# Ubuntu/Debian:
sudo apt-get install mongodb

# Start service
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

---

## Quick Troubleshooting

### Check if MongoDB is running:

**Windows:**
```powershell
Get-Service MongoDB
# If not running:
Start-Service MongoDB
```

**Mac/Linux:**
```bash
# Check status
brew services list | grep mongodb  # Mac
sudo systemctl status mongodb      # Linux

# Start if not running
brew services start mongodb-community  # Mac
sudo systemctl start mongodb          # Linux
```

### Test MongoDB connection manually:

**Windows/Mac/Linux:**
```bash
# If mongosh is installed
mongosh mongodb://localhost:27017/portfolio

# Or using mongo client (older versions)
mongo mongodb://localhost:27017/portfolio
```

### Common Issues:

1. **Port 27017 already in use:**
   - Check what's using the port: `netstat -ano | findstr :27017` (Windows)
   - Stop the conflicting service or change MongoDB port

2. **Permission errors:**
   - Run MongoDB as Administrator (Windows)
   - Check file permissions on MongoDB data directory

3. **Connection timeout with Atlas:**
   - Verify your IP is whitelisted in Network Access
   - Check your username/password in connection string
   - Ensure you're using the correct cluster connection string

---

## Recommendation

**For development:** Use MongoDB Atlas (Option 1) - it's easier, free, and works anywhere.

**For production:** Use MongoDB Atlas or a managed MongoDB service.

---

## Need Help?

If you're still having issues:
1. Check the error message carefully
2. Verify your `.env` file has the correct `MONGODB_URI`
3. Make sure there are no typos in the connection string
4. For Atlas: Ensure your IP is whitelisted and credentials are correct

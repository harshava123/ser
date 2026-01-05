# MongoDB Databases Explained

## System Databases (Created by MongoDB)

### 1. `admin` Database
- **Purpose**: Stores MongoDB administrative data and user authentication
- **Contains**: 
  - User accounts with admin privileges
  - System users (like your `admin` user)
- **Should you use it?**: No, this is for MongoDB's internal use
- **Can you delete it?**: No, MongoDB needs this

### 2. `config` Database
- **Purpose**: Stores configuration for MongoDB sharding (if enabled)
- **Contains**: Shard configuration, chunk information
- **Should you use it?**: No, this is for MongoDB's internal use
- **Can you delete it?**: No, MongoDB needs this

### 3. `local` Database
- **Purpose**: Stores local/replica set data
- **Contains**: 
  - Replication oplog (operation log)
  - Local configuration
- **Should you use it?**: No, this is for MongoDB's internal use
- **Can you delete it?**: No, MongoDB needs this

## Your Application Databases

### 4. `myapp` Database ⭐
- **Purpose**: **YOUR APPLICATION DATABASE**
- **Contains**: 
  - `users` collection (your signup/login users)
  - Any other collections your app creates
- **Should you use it?**: **YES! This is where your app data is stored**
- **This is the important one!** This is where all your signup users are stored.

### 5. `artihcus_db` Database
- **Purpose**: Another application database (possibly from another project)
- **Contains**: Unknown - might be from another application
- **Should you use it?**: Only if it's from another project you're working on
- **Note**: This might be from a different application (like the hr-portal-backend we saw earlier)

## Summary

| Database | Type | Purpose | Your Data? |
|----------|------|---------|------------|
| `admin` | System | MongoDB admin users | ❌ No |
| `config` | System | Sharding config | ❌ No |
| `local` | System | Replication data | ❌ No |
| `myapp` | **Application** | **Your app data** | ✅ **YES** |
| `artihcus_db` | Application | Another project? | ❓ Maybe |

## What You Should Focus On

**Click on `myapp` → `users` collection** - This is where all your signup/login users are stored!

The other databases (`admin`, `config`, `local`) are MongoDB system databases - you can ignore them. They're created automatically by MongoDB.

## Your Application Data Location

✅ **Your users are in**: `myapp` → `users` collection

This is where all signup data from your frontend (`https://fer-henna-omega.vercel.app`) is being saved!


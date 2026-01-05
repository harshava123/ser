# Backend Linting Guide

## ESLint is Now Set Up! ✅

ESLint checks your code for errors, bugs, and style issues.

## Available Commands

### Check for Errors

```cmd
npm run lint
```

**What it does:**
- Scans all `.js` files in the backend folder
- Reports errors, warnings, and style issues
- Exits with code 0 if no errors

### Auto-Fix Errors

```cmd
npm run lint:fix
```

**What it does:**
- Automatically fixes simple errors (spacing, quotes, etc.)
- Reports errors that can't be auto-fixed
- Saves you time!

## Example Output

### No Errors:
```
> backend@1.0.0 lint
> eslint .
```

(No output = all good! ✅)

### With Errors:
```
D:\ser\backend\server.js
  5:1  error  'authRoutes' is assigned a value but never used  no-unused-vars
  10:5  warning  Unexpected console.log statement  no-console
```

## What ESLint Checks

- ✅ Syntax errors
- ✅ Unused variables
- ✅ Undefined variables
- ✅ Code style issues
- ✅ Best practices

## Configuration

ESLint config is in: `eslint.config.js`

**Current rules:**
- Warns on unused variables
- Allows console.log (for debugging)
- Enforces modern JavaScript standards

## Add to Your Workflow

### Before Committing Code:

```cmd
npm run lint
```

### If Errors Found:

```cmd
npm run lint:fix
```

Then review and commit.

## VS Code Integration

If you use VS Code, install the ESLint extension:
1. Open VS Code
2. Go to Extensions
3. Search "ESLint"
4. Install
5. Errors will show in editor automatically!

## Summary

- ✅ `npm run lint` - Check for errors
- ✅ `npm run lint:fix` - Auto-fix errors
- ✅ No build needed (Node.js runs directly)
- ✅ Linting catches errors before runtime

## Quick Test

Run this to see it working:

```cmd
cd D:\ser\backend
npm run lint
```

If you see no output, your code is clean! ✅


# À Qui Le Tour - Development Instructions

## Version Management

**Every time you make changes to this project, you MUST increment the version number in ONE place only.**

### Where to Update the Version

Edit **`script.js`** - Line 7:

```javascript
const VERSION = '1.0.2';
```

That's it! The version is automatically:
- Displayed in the version badge (top-right corner of the webpage)
- Used throughout the application

**Current Version:** 1.0.2

### Versioning Scheme

Use **Semantic Versioning** (MAJOR.MINOR.PATCH):

- **PATCH** (1.0.1 → 1.0.2): Bug fixes, minor CSS tweaks, small improvements
- **MINOR** (1.0.0 → 1.1.0): New features, new functionality
- **MAJOR** (1.0.0 → 2.0.0): Breaking changes, major redesigns

### Increment Process (Before Committing)

1. Open `script.js`
2. Find line 7: `const VERSION = '1.0.2';`
3. Update to new version: `const VERSION = '1.0.3';`
4. Save
5. Commit with message: "Bump version to 1.0.3" (or your new version)

### Example: Making a Bug Fix

```
1. Fix bug in script.js or style.css
2. Update script.js line 7: const VERSION = '1.0.3';
3. Commit: "Fix wheel rotation bug; bump to 1.0.3"
4. Push
5. Users see "v1.0.3" badge on the webpage
```

### How It Works

- The version badge is auto-populated by the `displayVersion()` function
- No need for query string cache-busters (`?v=1.0.2`)
- No need to update multiple files
- Single source of truth in `script.js`

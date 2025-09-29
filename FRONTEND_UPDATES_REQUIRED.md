# Frontend Updates Required for Event Deletion Support

## 🎯 **Critical Files That Need Updates**

Based on my analysis of your IIN frontend codebase, here are the specific files that need to be updated to support event deletion filtering:

---

## 📁 **File: `/helpers/queries.js`**

This is the main queries file that contains all GROQ queries. **5 queries need updates:**

### 1. `syncEventsQuery` (Line 340)
```groq
// CURRENT
"syncEvent": *[_type == "syncEvent"]{

// UPDATE TO
"syncEvent": *[_type == "syncEvent" && deleted != true]{
```

### 2. `eventsQuery` (Line 371)
```groq
// CURRENT
"events": *[_type == "events" && showOnWebsite == true]{

// UPDATE TO
"events": *[_type == "events" && showOnWebsite == true && deleted != true]{
```

### 3. `eventsSlugQuery` (Line 400)
```groq
// CURRENT
"current": *[_type in ["events", "syncEvent"] && slug.current == $slug && showOnWebsite == true][0] {

// UPDATE TO
"current": *[_type in ["events", "syncEvent"] && slug.current == $slug && showOnWebsite == true && deleted != true][0] {
```

### 4. `eventsSlugQuery` - Related Events (Line 432)
```groq
// CURRENT
"relatedEvents": *[_type == "events" && slug.current != $slug && defined(slug.current) && showOnWebsite == true][0..2] {

// UPDATE TO
"relatedEvents": *[_type == "events" && slug.current != $slug && defined(slug.current) && showOnWebsite == true && deleted != true][0..2] {
```

### 5. `eventsSlugQuery` - Related Sync Events (Line 440)
```groq
// CURRENT
"relatedSyncEvents": *[_type == "syncEvent" && slug.current != $slug && defined(slug.current) && showOnWebsite == true][0..2] {

// UPDATE TO
"relatedSyncEvents": *[_type == "syncEvent" && slug.current != $slug && defined(slug.current) && showOnWebsite == true && deleted != true][0..2] {
```

### 6. `eventsSlugQuery` - More Events (Line 448)
```groq
// CURRENT
"more": *[(_type == "events" || _type == "syncEvent") && showOnWebsite == true][0..6] {

// UPDATE TO
"more": *[(_type == "events" || _type == "syncEvent") && showOnWebsite == true && deleted != true][0..6] {
```

---

## 📁 **File: `/pages/events/[slug].js`**

### Update `getStaticPaths` (Line 347)
```groq
// CURRENT
const allEventSlugs = await sanity.fetch(`*[_type in ["events", "syncEvent"] && defined(slug.current) && showOnWebsite == true][].slug.current`);

// UPDATE TO
const allEventSlugs = await sanity.fetch(`*[_type in ["events", "syncEvent"] && defined(slug.current) && showOnWebsite == true && deleted != true][].slug.current`);
```

---

## 📁 **Files That DON'T Need Updates**

These files are safe because they use the queries from `helpers/queries.js`:

- ✅ `/pages/events/index.js` - Uses `eventsQuery` and `syncEventsQuery`
- ✅ `/pages/whats-on.js` - Uses `eventsQuery` and `syncEventsQuery`
- ✅ Other pages that use the centralized queries

---

## 🚀 **Quick Update Script**

Here's a script you can run to make all the updates at once:

```bash
cd /Users/liamnelson/Sites/iin

# Backup the original file
cp helpers/queries.js helpers/queries.js.backup

# Update syncEventsQuery
sed -i '' 's/"syncEvent": \*\[_type == "syncEvent"\]/"syncEvent": *[_type == "syncEvent" \&\& deleted != true]/g' helpers/queries.js

# Update eventsQuery
sed -i '' 's/"events": \*\[_type == "events" \&\& showOnWebsite == true\]/"events": *[_type == "events" \&\& showOnWebsite == true \&\& deleted != true]/g' helpers/queries.js

# Update eventsSlugQuery current
sed -i '' 's/\*\[_type in \["events", "syncEvent"\] \&\& slug.current == \$slug \&\& showOnWebsite == true\]/\*[_type in ["events", "syncEvent"] \&\& slug.current == $slug \&\& showOnWebsite == true \&\& deleted != true]/g' helpers/queries.js

# Update related events
sed -i '' 's/\*\[_type == "events" \&\& slug.current != \$slug \&\& defined(slug.current) \&\& showOnWebsite == true\]/\*[_type == "events" \&\& slug.current != $slug \&\& defined(slug.current) \&\& showOnWebsite == true \&\& deleted != true]/g' helpers/queries.js

# Update related sync events
sed -i '' 's/\*\[_type == "syncEvent" \&\& slug.current != \$slug \&\& defined(slug.current) \&\& showOnWebsite == true\]/\*[_type == "syncEvent" \&\& slug.current != $slug \&\& defined(slug.current) \&\& showOnWebsite == true \&\& deleted != true]/g' helpers/queries.js

# Update more events
sed -i '' 's/\*\[(_type == "events" || _type == "syncEvent") \&\& showOnWebsite == true\]/\*[(_type == "events" || _type == "syncEvent") \&\& showOnWebsite == true \&\& deleted != true]/g' helpers/queries.js

# Update getStaticPaths in events/[slug].js
sed -i '' 's/\*\[_type in \["events", "syncEvent"\] \&\& defined(slug.current) \&\& showOnWebsite == true\]/\*[_type in ["events", "syncEvent"] \&\& defined(slug.current) \&\& showOnWebsite == true \&\& deleted != true]/g' pages/events/\[slug\].js

echo "✅ All frontend queries updated!"
```

---

## 🧪 **Testing Checklist**

After making the updates:

1. **Local Development**:
   ```bash
   cd /Users/liamnelson/Sites/iin
   npm run dev
   ```

2. **Test These Pages**:
   - [ ] Homepage (check event sections)
   - [ ] `/events` - Events listing page
   - [ ] `/events/[slug]` - Individual event pages
   - [ ] `/whats-on` - What's On page
   - [ ] Event-related components

3. **Verify Filtering**:
   - [ ] Deleted events don't appear in listings
   - [ ] Deleted event pages return 404
   - [ ] Related events exclude deleted ones
   - [ ] Static generation only includes active events

---

## 🔄 **Deployment Process**

1. **Make Updates** using the script above or manually
2. **Test Locally** to ensure everything works
3. **Deploy Frontend** to your hosting platform
4. **Test Production** to confirm deleted events are filtered
5. **Monitor** for any issues

---

## ⚠️ **Important Notes**

- **Backup First**: Always backup files before making changes
- **Test Thoroughly**: Verify all event-related functionality still works
- **Static Regeneration**: You may need to trigger a rebuild to update static pages
- **Cache Clearing**: Clear any CDN/browser caches after deployment

---

## 📊 **Impact Summary**

**Files Updated**: 2 files
**Queries Updated**: 6 GROQ queries
**Pages Affected**: Events listing, event details, what's on, homepage
**Estimated Time**: 15-30 minutes for updates + testing

---

## 🆘 **Rollback Plan**

If anything goes wrong:
```bash
cd /Users/liamnelson/Sites/iin
cp helpers/queries.js.backup helpers/queries.js
git checkout pages/events/[slug].js  # if using git
```

The changes are simple additions of `&& deleted != true` to existing queries, so the risk is minimal.
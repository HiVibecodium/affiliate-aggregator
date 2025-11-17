# ✅ Manual QA Checklist - Pre-Launch

**Platform:** Affiliate Aggregator
**URL:** https://affiliate-aggregator-five.vercel.app
**Time Required:** ~1 hour
**Date:** 2025-01-17

---

## 🎯 How to Use This Checklist

**For each section:**

1. Open the URL in browser
2. Test the functionality
3. Check the box if works
4. Note any issues found

**Browser testing:**

- Chrome/Edge (primary)
- Firefox (optional)
- Safari (optional)
- Mobile browser (important!)

---

## 📱 SECTION 1: Home Page (5 min)

**URL:** https://affiliate-aggregator-five.vercel.app/

### Visual Elements

- [ ] Page loads without errors
- [ ] Hero title displays: "Global Affiliate Networks Aggregator"
- [ ] Stats cards show numbers (80,010 programs, 6 networks)
- [ ] All 7 action buttons visible and styled
- [ ] Network cards (6) display with counts
- [ ] Gradients and styling look good

### Functionality

- [ ] Click "Посмотреть все программы" → goes to /programs
- [ ] Click "Новые программы" → goes to /programs/new
- [ ] Click "Избранное" → goes to /favorites
- [ ] Click "Dashboard" → goes to /dashboard
- [ ] Click "Аналитика" → goes to /analytics
- [ ] Network cards clickable → filter by network
- [ ] Theme toggle visible (if deployed)

### Mobile

- [ ] Responsive on mobile (test narrow screen)
- [ ] Buttons stack properly
- [ ] Stats cards responsive

**Issues found:** ********\_\_\_\_********

---

## 🔍 SECTION 2: Programs Listing (10 min)

**URL:** https://affiliate-aggregator-five.vercel.app/programs

### Page Load

- [ ] Programs list loads
- [ ] Shows count (80,010 programs from 6 networks)
- [ ] Filter sidebar visible on left
- [ ] Programs display as cards

### Filters (11 total)

- [ ] Search by name input field
- [ ] Network dropdown
- [ ] Category dropdown
- [ ] Commission type dropdown
- [ ] Country filter
- [ ] Commission range (min/max inputs)
- [ ] Payment method dropdown
- [ ] Cookie duration (min/max)
- [ ] Payment threshold (min/max)
- [ ] Difficulty checkboxes (Easy/Medium/Hard)
- [ ] "Has Reviews" checkbox

### Filter Functionality

- [ ] Select a network → programs filter
- [ ] Select a category → programs filter
- [ ] Enter search term → suggestions appear
- [ ] Click suggestion → goes to program
- [ ] Select commission type → filters work
- [ ] Commission range → filters work
- [ ] Click "Reset" button → clears all filters
- [ ] Active filter count shows
- [ ] URL updates with filter params

### Program Cards

- [ ] Cards show program name, network
- [ ] Commission rate visible
- [ ] Cookie duration shown
- [ ] Payment methods displayed
- [ ] Badges visible (NEW, Quality, Difficulty)
- [ ] "View Details" button works
- [ ] ❤️ Favorite button works
- [ ] ⚖️ Compare button works

### Sorting & Pagination

- [ ] Sort by date/commission/name works
- [ ] Ascending/descending toggle works
- [ ] Pagination buttons work
- [ ] Page numbers display
- [ ] Can navigate to page 2, 3, etc.

**Issues found:** ********\_\_\_\_********

---

## 📄 SECTION 3: Program Detail Page (5 min)

**URL:** Click any program from listing

### Page Elements

- [ ] Breadcrumbs visible (Home / Programs / Category / Name)
- [ ] Program name as H1
- [ ] Network name shown
- [ ] Description displayed
- [ ] All stats cards (Commission, Cookie, Min Payout, Methods)
- [ ] Payment methods list
- [ ] Related programs section
- [ ] Reviews section
- [ ] Review form

### Functionality

- [ ] "Track Application" button works
- [ ] "Add to Favorites" button works
- [ ] "Add to Compare" button works
- [ ] "Go to Program" button links correctly
- [ ] Can write a review
- [ ] Can rate (1-5 stars)
- [ ] Related programs clickable

### SEO (View Source)

- [ ] JSON-LD script tag present
- [ ] Breadcrumb schema present
- [ ] Meta tags proper
- [ ] OG image tag present

**Issues found:** ********\_\_\_\_********

---

## 📊 SECTION 4: Analytics Page (5 min)

**URL:** https://affiliate-aggregator-five.vercel.app/analytics

### Page Load

- [ ] Page loads without errors
- [ ] Charts render properly
- [ ] Data displays

### Components

- [ ] StatsCards showing metrics
- [ ] CommissionChart (bar/pie chart)
- [ ] CategoryChart (distribution)
- [ ] TrendChart (time series)
- [ ] TopProgramsTable with data

### Data

- [ ] Numbers make sense
- [ ] Charts interactive (hover shows values)
- [ ] No console errors

**Issues found:** ********\_\_\_\_********

---

## 🏢 SECTION 5: Team Management (10 min)

**URL:** https://affiliate-aggregator-five.vercel.app/settings/team

### Page Load

- [ ] Team page loads
- [ ] Shows organization info
- [ ] Member list visible
- [ ] Seat usage displayed (X/Y seats)

### Invite Flow

- [ ] "Invite Member" button visible
- [ ] Click opens modal/form
- [ ] Can enter email address
- [ ] Can select role (Member, Admin, etc.)
- [ ] "Send Invitation" button works
- [ ] Shows success message
- [ ] (If possible) Check email received

### Member Management

- [ ] Can see all members
- [ ] Roles displayed correctly
- [ ] Can change member role
- [ ] Can remove member
- [ ] Confirmation modals work
- [ ] Seat limit enforced (can't exceed tier)

**Issues found:** ********\_\_\_\_********

---

## ⚙️ SECTION 6: Settings (5 min)

**URL:** https://affiliate-aggregator-five.vercel.app/settings

### Sections Visible

- [ ] Notifications settings
- [ ] Display preferences
- [ ] Team section with links
- [ ] Save button

### Functionality

- [ ] Toggle email notifications
- [ ] Toggle new program alerts
- [ ] Change display settings
- [ ] Click "Team Management" → goes to /settings/team
- [ ] Click "Organization Settings" → goes to /settings/organization
- [ ] Save button works
- [ ] Settings persist

**Issues found:** ********\_\_\_\_********

---

## 🏢 SECTION 7: Organization Settings (5 min)

**URL:** https://affiliate-aggregator-five.vercel.app/settings/organization

### Form Fields

- [ ] Organization name field
- [ ] Slug field
- [ ] Description textarea
- [ ] Logo upload
- [ ] Website URL field
- [ ] Save button

### Danger Zone

- [ ] "Delete Organization" visible
- [ ] "Transfer Ownership" visible
- [ ] Click shows confirmation modal
- [ ] Warning messages clear

**Issues found:** ********\_\_\_\_********

---

## 💰 SECTION 8: Billing & Pricing (10 min)

**URL:** https://affiliate-aggregator-five.vercel.app/billing/upgrade

### Pricing Page

- [ ] 4 pricing tiers displayed (Free, Pro, Business, Enterprise)
- [ ] Prices shown: $12/mo, $49/mo
- [ ] Monthly/Annual toggle works
- [ ] Annual discount shown (30-32%)
- [ ] Features listed for each tier
- [ ] "Upgrade" buttons work

### Billing Flow (if testing with Stripe test mode)

- [ ] Click upgrade → Stripe checkout opens
- [ ] Can enter test card (4242 4242 4242 4242)
- [ ] Subscription creates successfully
- [ ] Redirects to success page
- [ ] Subscription shows in /billing

### Current Subscription (if logged in)

- [ ] /billing shows current plan
- [ ] Can access billing portal
- [ ] Can change plan
- [ ] Can cancel subscription

**Issues found:** ********\_\_\_\_********

---

## 🆕 SECTION 9: New Programs (5 min)

**URL:** https://affiliate-aggregator-five.vercel.app/programs/new

### Tabs

- [ ] "7 days" tab
- [ ] "30 days" tab
- [ ] "90 days" tab (if added)
- [ ] Tabs switch properly
- [ ] Programs filter by date

### Display

- [ ] Programs show "NEW" badge
- [ ] Sorted by newest first
- [ ] Date information visible

**Issues found:** ********\_\_\_\_********

---

## ❤️ SECTION 10: Favorites (5 min)

**URL:** https://affiliate-aggregator-five.vercel.app/favorites

### Requires Login

- [ ] If not logged in → redirects to login
- [ ] Can log in or sign up
- [ ] After login → see favorites page

### If Have Favorites

- [ ] Favorites list displays
- [ ] Can remove from favorites
- [ ] Export to CSV button works
- [ ] CSV downloads properly
- [ ] Shows empty state if no favorites

**Issues found:** ********\_\_\_\_********

---

## ⚖️ SECTION 11: Comparison (5 min)

**URL:** https://affiliate-aggregator-five.vercel.app/compare

### Add Programs

- [ ] Go to /programs
- [ ] Click ⚖️ on 2-3 programs
- [ ] Comparison bar appears at bottom
- [ ] Shows count (3 programs)
- [ ] "Compare" button enabled

### Comparison Page

- [ ] Click "Compare" → goes to /compare
- [ ] Side-by-side table shows
- [ ] All program details visible
- [ ] Can remove programs
- [ ] Export functionality works

**Issues found:** ********\_\_\_\_********

---

## 🌙 SECTION 12: Dark Mode (5 min)

**If ThemeToggle is deployed:**

### Toggle Functionality

- [ ] Theme toggle button visible (moon/sun icon)
- [ ] Click toggles dark mode
- [ ] Page transitions smoothly
- [ ] All colors readable in dark mode
- [ ] Images/logos visible
- [ ] Refresh maintains theme (localStorage)

### Pages to Check

- [ ] Home page in dark mode
- [ ] Programs page in dark mode
- [ ] Program detail in dark mode
- [ ] Analytics in dark mode
- [ ] Settings in dark mode

**Issues found:** ********\_\_\_\_********

---

## 📱 SECTION 13: Mobile Testing (10 min)

**Test on mobile device or narrow browser window (<768px)**

### Responsive Design

- [ ] Home page responsive
- [ ] Programs page responsive
- [ ] Filters accessible (mobile drawer?)
- [ ] Program cards stack vertically
- [ ] Buttons touch-friendly (min 44x44px)
- [ ] Text readable (not too small)
- [ ] Navigation works
- [ ] Forms usable on mobile

### Touch Interactions

- [ ] Can tap all buttons
- [ ] Can scroll smoothly
- [ ] Modals work on mobile
- [ ] No horizontal scroll
- [ ] Zoom works properly

**Issues found:** ********\_\_\_\_********

---

## 🔐 SECTION 14: Auth Flow (5 min)

**Test login/signup if needed:**

### Signup

- [ ] /signup page loads
- [ ] Can enter email & password
- [ ] Sign up button works
- [ ] Creates account successfully
- [ ] Redirects after signup

### Login

- [ ] /login page loads
- [ ] Can enter credentials
- [ ] Login button works
- [ ] Redirects to dashboard/programs
- [ ] Session persists

### Logout

- [ ] Logout button/link visible
- [ ] Click logs out
- [ ] Redirects to home/login
- [ ] Protected pages redirect to login

**Issues found:** ********\_\_\_\_********

---

## 🚨 SECTION 15: Error Handling (5 min)

### Test Edge Cases

- [ ] Visit non-existent program: /programs/fake-id → 404?
- [ ] Visit non-existent page: /fake-page → 404?
- [ ] Try to access protected page without login → redirects?
- [ ] Submit form with invalid data → shows error?
- [ ] Network error simulation → graceful handling?

### Error Pages

- [ ] 404 page exists and looks good
- [ ] Error messages are helpful
- [ ] Can navigate back from error

**Issues found:** ********\_\_\_\_********

---

## ✅ QA SUMMARY

### Total Checks: ~100 items

**Passed:** **\_** / 100
**Failed:** **\_** / 100
**Skipped:** **\_** / 100

### Critical Issues Found:

1. ***
2. ***
3. ***

### Minor Issues Found:

1. ***
2. ***
3. ***

### Notes:

---

---

---

---

## 🎯 Launch Decision

### If >95% checks pass AND 0 critical issues:

✅ **APPROVED FOR LAUNCH**

### If 90-95% checks pass:

🟡 **Fix critical issues, then launch**

### If <90% checks pass:

🔴 **Fix issues before launch**

---

## 📋 Post-QA Actions

### If Approved:

- [ ] Document any minor issues
- [ ] Create post-launch fix list
- [ ] Set up monitoring alerts
- [ ] Prepare for soft launch

### If Issues Found:

- [ ] Prioritize by severity
- [ ] Fix critical issues first
- [ ] Re-test after fixes
- [ ] Re-run QA checklist

---

## 🔍 Automated Checks (Already Done ✅)

**Reference:** `QA_REPORT_2025-01-17.md`

- [x] TypeScript: 0 errors ✅
- [x] ESLint: 0 errors ✅
- [x] Tests: 380 passing ✅
- [x] Build: SUCCESS ✅
- [x] Security: 0 vulnerabilities ✅

---

## 🚀 Final Sign-Off

**QA Performed By:** ********\_\_\_\_********
**Date:** ********\_\_\_\_********
**Result:** ✅ PASS / 🟡 PASS WITH ISSUES / 🔴 FAIL

**Ready for Launch?** ✅ YES / ❌ NO

**Notes:**

---

---

---

## 📞 If You Find Issues

### Report Format:

**Page:** /programs
**Issue:** Filter doesn't work
**Steps:** 1. Go to /programs 2. Select network 3. Nothing happens
**Expected:** Programs should filter
**Actual:** No filtering occurs
**Priority:** High/Medium/Low
**Screenshot:** (if possible)

### Where to Report:

- Create GitHub issue
- Or document in ISSUES.md
- Or note here

---

## 💡 Tips for Effective QA

1. **Clear browser cache** before starting
2. **Use incognito/private mode** for fresh session
3. **Test as new user** (sign up with test email)
4. **Test as existing user** (login with account)
5. **Try to break things** (edge cases, weird inputs)
6. **Check browser console** for errors (F12)
7. **Test on mobile** (real device or DevTools)
8. **Take notes** of anything unexpected

---

## 🎊 Quick Pre-Flight Check

**Before you start, verify:**

- [ ] Site is accessible: https://affiliate-aggregator-five.vercel.app
- [ ] Latest deployment is live (check Vercel dashboard)
- [ ] No active incidents (check Vercel status)
- [ ] Sentry is configured (will catch errors)

**Ready to test?** Start with Section 1! 🚀

---

**Created:** 2025-01-17
**For:** Pre-launch manual QA
**Estimated Time:** 1 hour

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>

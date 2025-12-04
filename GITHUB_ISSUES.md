# GitHub Issues to Create

This document lists all TODO items found in the codebase that should be converted to GitHub Issues.

## Issues List

### 1. Authentication: Complete Invite Token Migration

**Priority:** High
**Labels:** `enhancement`, `authentication`, `migration`

**Description:**
Complete the migration for invite token system across all invitation-related endpoints.

**Affected Files:**

- `app/api/invite/accept/route.ts` (3 occurrences)
- `app/api/invite/decline/route.ts` (1 occurrence)
- `app/api/invite/verify/route.ts` (1 occurrence)
- `app/api/organizations/[orgId]/members/route.ts` (1 occurrence)

**Tasks:**

- [ ] Review invite token data model
- [ ] Uncomment `inviteToken` field in all endpoints
- [ ] Test invite acceptance flow
- [ ] Test invite decline flow
- [ ] Test invite verification flow
- [ ] Update organization member invitation
- [ ] Write integration tests

**Current State:**

```typescript
// inviteToken: token, // TODO: Uncomment after migration
```

---

### 2. Authentication: Get Current User from Session

**Priority:** High
**Labels:** `bug`, `authentication`, `security`

**Description:**
The invite acceptance endpoint currently lacks proper user session retrieval. This is a security concern as we need to verify the authenticated user before accepting invitations.

**Affected Files:**

- `app/api/invite/accept/route.ts`

**Current Code:**

```typescript
// TODO: Get current user from session/auth
```

**Tasks:**

- [ ] Implement proper session retrieval using Supabase Auth
- [ ] Add authentication middleware
- [ ] Verify user permissions
- [ ] Handle unauthenticated requests
- [ ] Write tests for authenticated and unauthenticated scenarios

---

### 3. Email: Send Referral Invitation Emails

**Priority:** Medium
**Labels:** `feature`, `email`, `referrals`

**Description:**
Implement email sending functionality for referral invitations. Currently, the referral system creates invites but doesn't notify users via email.

**Affected Files:**

- `app/api/referrals/route.ts`

**Current Code:**

```typescript
// TODO: Send invitation email
```

**Tasks:**

- [ ] Create email template for referral invitations
- [ ] Integrate with Resend email service (already configured)
- [ ] Add invitation link generation
- [ ] Include referral code in email
- [ ] Add error handling for email failures
- [ ] Log email sending attempts
- [ ] Write tests

**Email Template Should Include:**

- Personalized greeting
- Invitation from referrer's name
- Clear call-to-action button
- Benefits of joining
- Referral code/link
- Unsubscribe option

---

### 4. Billing: Failed Payment Notifications

**Priority:** High
**Labels:** `feature`, `billing`, `notifications`

**Description:**
Add user notifications when payment fails. This is critical for user retention and subscription recovery.

**Affected Files:**

- `lib/billing/webhooks.ts`

**Current Code:**

```typescript
// TODO: Send notification to user about failed payment
```

**Implementation Strategy:**

- [ ] Email notification with retry instructions
- [ ] In-app notification banner
- [ ] Update subscription status to 'past_due'
- [ ] Provide link to update payment method
- [ ] Include retry schedule information
- [ ] Log notification attempts

**Notification Channels:**

1. Email (immediate)
2. In-app banner (next login)
3. Optional: SMS for critical failures

---

### 5. SEO: Add Bing Webmaster Verification

**Priority:** Low
**Labels:** `enhancement`, `seo`

**Description:**
Add Bing Webmaster Tools verification meta tag to improve SEO and enable Bing search console features.

**Affected Files:**

- `app/layout.tsx`

**Tasks:**

- [ ] Register site with Bing Webmaster Tools
- [ ] Get verification code
- [ ] Add meta tag to layout
- [ ] Verify ownership in Bing console
- [ ] Submit sitemap to Bing
- [ ] Set up Bing crawl rate

**Reference:**
https://www.bing.com/webmasters/

---

### 6. SEO: Add Yandex Webmaster Verification (Optional)

**Priority:** Low
**Labels:** `enhancement`, `seo`, `optional`

**Description:**
Add Yandex Webmaster verification for Russian market SEO. Only needed if targeting Russian-speaking audience.

**Affected Files:**

- `app/layout.tsx`

**Tasks:**

- [ ] Assess need based on target audience
- [ ] Register with Yandex Webmaster (if applicable)
- [ ] Get verification code
- [ ] Add meta tag
- [ ] Verify ownership
- [ ] Submit sitemap

**Note:** Mark as `wontfix` if not targeting Russian market.

---

### 7. Organizations: Implement Client-Side Organization Switching

**Priority:** Medium
**Labels:** `feature`, `organizations`, `ux`

**Description:**
Enable users to switch between organizations using client-side routing. Currently commented out.

**Affected Files:**

- `components/OrganizationSwitcher.tsx`

**Current Code:**

```typescript
// import { createClient } from '@/lib/supabase/client'; // TODO: Use when implementing org switching
```

**Tasks:**

- [ ] Uncomment Supabase client import
- [ ] Implement organization switching logic
- [ ] Update user context on switch
- [ ] Persist selected organization in local storage
- [ ] Handle organization permission changes
- [ ] Add loading states during switch
- [ ] Update breadcrumbs/navigation
- [ ] Write E2E tests

**UX Considerations:**

- Smooth transition without page reload
- Show current organization clearly
- Handle cases where user loses access mid-session
- Prompt user to save unsaved changes before switching

---

## Creation Commands

To create these issues using GitHub CLI:

```bash
# Issue 1: Invite Token Migration
gh issue create --title "Complete invite token migration across all invitation endpoints" \
  --body "$(cat <<'EOF'
Priority: High
Labels: enhancement, authentication, migration

Complete the migration for invite token system across all invitation-related endpoints.

Affected Files:
- app/api/invite/accept/route.ts (3 occurrences)
- app/api/invite/decline/route.ts
- app/api/invite/verify/route.ts
- app/api/organizations/[orgId]/members/route.ts

Tasks:
- [ ] Review invite token data model
- [ ] Uncomment inviteToken field in all endpoints
- [ ] Test invite acceptance flow
- [ ] Test invite decline flow
- [ ] Test invite verification flow
- [ ] Update organization member invitation
- [ ] Write integration tests

See GITHUB_ISSUES.md for full details.
EOF
)" \
  --label "enhancement,authentication,migration" \
  --repo Vibecodium/affiliate-aggregator

# Issue 2: Current User Session
gh issue create --title "Implement current user session retrieval in invite acceptance" \
  --body "$(cat <<'EOF'
Priority: High
Labels: bug, authentication, security

The invite acceptance endpoint lacks proper user session retrieval.

Location: app/api/invite/accept/route.ts

Tasks:
- [ ] Implement Supabase Auth session retrieval
- [ ] Add authentication middleware
- [ ] Verify user permissions
- [ ] Handle unauthenticated requests
- [ ] Write tests

See GITHUB_ISSUES.md for full details.
EOF
)" \
  --label "bug,authentication,security" \
  --repo Vibecodium/affiliate-aggregator

# Issue 3: Referral Emails
gh issue create --title "Implement referral invitation email notifications" \
  --body "$(cat <<'EOF'
Priority: Medium
Labels: feature, email, referrals

Send email notifications when users are invited via referral system.

Location: app/api/referrals/route.ts

Tasks:
- [ ] Create email template
- [ ] Integrate with Resend
- [ ] Generate invitation links
- [ ] Handle errors
- [ ] Write tests

See GITHUB_ISSUES.md for full details.
EOF
)" \
  --label "feature,email,referrals" \
  --repo Vibecodium/affiliate-aggregator

# Issue 4: Failed Payment Notifications
gh issue create --title "Add user notifications for failed payments" \
  --body "$(cat <<'EOF'
Priority: High
Labels: feature, billing, notifications

Notify users when payments fail to improve subscription recovery.

Location: lib/billing/webhooks.ts

Channels:
- Email (immediate)
- In-app banner
- Optional SMS

Tasks:
- [ ] Email notification with retry instructions
- [ ] In-app notification banner
- [ ] Update subscription status
- [ ] Write tests

See GITHUB_ISSUES.md for full details.
EOF
)" \
  --label "feature,billing,notifications" \
  --repo Vibecodium/affiliate-aggregator

# Issue 5: Bing Webmaster
gh issue create --title "Add Bing Webmaster Tools verification" \
  --body "$(cat <<'EOF'
Priority: Low
Labels: enhancement, seo

Add Bing verification meta tag for SEO.

Location: app/layout.tsx

Tasks:
- [ ] Register with Bing Webmaster Tools
- [ ] Add verification meta tag
- [ ] Submit sitemap

See GITHUB_ISSUES.md for full details.
EOF
)" \
  --label "enhancement,seo" \
  --repo Vibecodium/affiliate-aggregator

# Issue 6: Yandex Webmaster (Optional)
gh issue create --title "Add Yandex Webmaster verification (optional)" \
  --body "$(cat <<'EOF'
Priority: Low
Labels: enhancement, seo, optional

Add Yandex verification for Russian market (if targeting).

Location: app/layout.tsx

Assess need based on target audience before implementing.

See GITHUB_ISSUES.md for full details.
EOF
)" \
  --label "enhancement,seo,optional" \
  --repo Vibecodium/affiliate-aggregator

# Issue 7: Organization Switching
gh issue create --title "Implement client-side organization switching" \
  --body "$(cat <<'EOF'
Priority: Medium
Labels: feature, organizations, ux

Enable users to switch between organizations without page reload.

Location: components/OrganizationSwitcher.tsx

Tasks:
- [ ] Uncomment Supabase client import
- [ ] Implement switching logic
- [ ] Update user context
- [ ] Persist selection in localStorage
- [ ] Handle permission changes
- [ ] Add loading states
- [ ] Write E2E tests

See GITHUB_ISSUES.md for full details.
EOF
)" \
  --label "feature,organizations,ux" \
  --repo Vibecodium/affiliate-aggregator
```

## Summary

**Total Issues:** 7

**By Priority:**

- High: 3 (Invite token, Auth session, Payment notifications)
- Medium: 2 (Referral emails, Org switching)
- Low: 2 (Bing, Yandex verification)

**By Type:**

- Features: 4
- Enhancements: 2
- Bugs: 1

**Next Steps:**

1. Review and prioritize issues
2. Create issues using gh CLI commands above
3. Assign to team members
4. Add to project board/milestone
5. Remove TODO comments as issues are addressed

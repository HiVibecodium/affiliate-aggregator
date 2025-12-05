/**
 * Email Templates System
 * HTML email templates with consistent branding
 */

const APP_NAME = 'Affiliate Aggregator';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://affiliate-aggregator-five.vercel.app';
const PRIMARY_COLOR = '#3b82f6';

/**
 * Base email layout wrapper
 */
function emailLayout(content: string, preheader?: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${APP_NAME}</title>
  ${preheader ? `<span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>` : ''}
  <style>
    body { margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background-color: #0f172a; padding: 24px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; }
    .content { padding: 32px 24px; }
    .button { display: inline-block; padding: 12px 24px; background-color: ${PRIMARY_COLOR}; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-weight: 500; }
    .button:hover { background-color: #2563eb; }
    .footer { background-color: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 12px; }
    .footer a { color: #64748b; }
    .divider { height: 1px; background-color: #e2e8f0; margin: 24px 0; }
    h2 { color: #0f172a; font-size: 20px; margin-top: 0; }
    p { color: #475569; line-height: 1.6; margin: 16px 0; }
    .highlight { background-color: #f0f9ff; border-left: 4px solid ${PRIMARY_COLOR}; padding: 16px; margin: 16px 0; }
    .metric { text-align: center; padding: 16px; }
    .metric-value { font-size: 32px; font-weight: 700; color: ${PRIMARY_COLOR}; }
    .metric-label { color: #64748b; font-size: 14px; }
    .card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .card-title { font-weight: 600; color: #0f172a; margin: 0 0 8px 0; }
    .card-text { color: #64748b; margin: 0; font-size: 14px; }
    .badge { display: inline-block; padding: 4px 8px; background-color: #dbeafe; color: ${PRIMARY_COLOR}; border-radius: 4px; font-size: 12px; font-weight: 500; }
  </style>
</head>
<body>
  <div style="padding: 20px;">
    <div class="container">
      <div class="header">
        <h1>${APP_NAME}</h1>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.</p>
        <p>
          <a href="${APP_URL}/settings">Manage Preferences</a> |
          <a href="${APP_URL}/settings#notifications">Unsubscribe</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Welcome email for new users
 */
export function welcomeEmail(user: { name: string; email: string }): {
  subject: string;
  html: string;
  text: string;
} {
  const content = `
    <h2>Welcome to ${APP_NAME}!</h2>
    <p>Hi ${user.name || 'there'},</p>
    <p>Thank you for joining ${APP_NAME}! We're excited to help you discover the best affiliate programs for your business.</p>

    <div class="divider"></div>

    <h3>Get Started</h3>
    <p>Here's what you can do:</p>
    <ul style="color: #475569; line-height: 1.8;">
      <li>Browse 80,000+ affiliate programs from top networks</li>
      <li>Compare commission rates and cookie durations</li>
      <li>Save your favorites for quick access</li>
      <li>Set up alerts for new programs in your niche</li>
    </ul>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${APP_URL}/programs" class="button">Browse Programs</a>
    </div>

    <div class="highlight">
      <strong>Pro Tip:</strong> Use our advanced filters to find programs with the highest commission rates in your category.
    </div>
  `;

  return {
    subject: `Welcome to ${APP_NAME}!`,
    html: emailLayout(content, 'Welcome! Start discovering the best affiliate programs.'),
    text: `Welcome to ${APP_NAME}!\n\nHi ${user.name || 'there'},\n\nThank you for joining! Visit ${APP_URL} to start browsing affiliate programs.`,
  };
}

/**
 * New program alert email
 */
export function newProgramAlertEmail(
  user: { name: string; email: string },
  programs: Array<{
    name: string;
    network: string;
    commission: string;
    category: string;
    id: string;
  }>
): { subject: string; html: string; text: string } {
  const programCards = programs
    .map(
      (p) => `
      <div class="card">
        <p class="card-title">${p.name}</p>
        <p class="card-text">
          <span class="badge">${p.network}</span>
          <span style="margin-left: 8px;">${p.commission} commission</span>
        </p>
        <p class="card-text">${p.category}</p>
        <a href="${APP_URL}/programs/${p.id}" style="color: ${PRIMARY_COLOR}; text-decoration: none; font-size: 14px;">View Details →</a>
      </div>
    `
    )
    .join('');

  const content = `
    <h2>New Programs Match Your Criteria</h2>
    <p>Hi ${user.name || 'there'},</p>
    <p>We found <strong>${programs.length} new affiliate program${programs.length > 1 ? 's' : ''}</strong> that match your saved search criteria.</p>

    ${programCards}

    <div style="text-align: center; margin: 32px 0;">
      <a href="${APP_URL}/programs" class="button">View All Programs</a>
    </div>
  `;

  return {
    subject: `${programs.length} New Affiliate Program${programs.length > 1 ? 's' : ''} Match Your Criteria`,
    html: emailLayout(content, `${programs.length} new programs found!`),
    text: `New Programs Match Your Criteria\n\n${programs.map((p) => `- ${p.name} (${p.network}): ${p.commission}`).join('\n')}`,
  };
}

/**
 * Weekly digest email
 */
export function weeklyDigestEmail(
  user: { name: string },
  stats: {
    newPrograms: number;
    topCategory: string;
    avgCommission: number;
    highlights: Array<{ name: string; network: string; commission: string; id: string }>;
  }
): { subject: string; html: string; text: string } {
  const highlightCards = stats.highlights
    .slice(0, 3)
    .map(
      (p) => `
      <div class="card">
        <p class="card-title">${p.name}</p>
        <p class="card-text">${p.network} • ${p.commission}</p>
        <a href="${APP_URL}/programs/${p.id}" style="color: ${PRIMARY_COLOR}; text-decoration: none; font-size: 14px;">View →</a>
      </div>
    `
    )
    .join('');

  const content = `
    <h2>Your Weekly Digest</h2>
    <p>Hi ${user.name || 'there'},</p>
    <p>Here's what happened this week in affiliate marketing:</p>

    <div style="display: flex; text-align: center; margin: 24px 0;">
      <div class="metric" style="flex: 1;">
        <div class="metric-value">${stats.newPrograms}</div>
        <div class="metric-label">New Programs</div>
      </div>
      <div class="metric" style="flex: 1;">
        <div class="metric-value">${stats.avgCommission}%</div>
        <div class="metric-label">Avg Commission</div>
      </div>
    </div>

    <div class="divider"></div>

    <h3>Top Trending Programs</h3>
    ${highlightCards}

    <div class="highlight">
      <strong>Trending Category:</strong> ${stats.topCategory} programs saw the most activity this week.
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${APP_URL}/programs" class="button">Explore More</a>
    </div>
  `;

  return {
    subject: `Weekly Digest: ${stats.newPrograms} New Programs This Week`,
    html: emailLayout(content, `${stats.newPrograms} new programs and more insights inside`),
    text: `Weekly Digest\n\n${stats.newPrograms} new programs this week\nAverage commission: ${stats.avgCommission}%\nTrending: ${stats.topCategory}`,
  };
}

/**
 * Password reset email
 */
export function passwordResetEmail(
  user: { name: string; email: string },
  resetLink: string
): { subject: string; html: string; text: string } {
  const content = `
    <h2>Reset Your Password</h2>
    <p>Hi ${user.name || 'there'},</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetLink}" class="button">Reset Password</a>
    </div>

    <p style="color: #64748b; font-size: 14px;">
      This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
    </p>

    <div class="divider"></div>

    <p style="color: #64748b; font-size: 12px;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${resetLink}" style="color: ${PRIMARY_COLOR}; word-break: break-all;">${resetLink}</a>
    </p>
  `;

  return {
    subject: 'Reset Your Password',
    html: emailLayout(content, 'Password reset requested'),
    text: `Reset Your Password\n\nClick this link to reset your password: ${resetLink}\n\nThis link expires in 1 hour.`,
  };
}

/**
 * Team invitation email
 */
export function teamInvitationEmail(
  inviter: { name: string },
  invitee: { email: string },
  organization: { name: string },
  inviteLink: string
): { subject: string; html: string; text: string } {
  const content = `
    <h2>You've Been Invited!</h2>
    <p>Hi,</p>
    <p><strong>${inviter.name}</strong> has invited you to join <strong>${organization.name}</strong> on ${APP_NAME}.</p>

    <div class="highlight">
      <p style="margin: 0;">As a team member, you'll be able to:</p>
      <ul style="margin: 8px 0 0 0; padding-left: 20px;">
        <li>Access shared program lists</li>
        <li>Collaborate on analytics</li>
        <li>Share notes and reviews</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${inviteLink}" class="button">Accept Invitation</a>
    </div>

    <p style="color: #64748b; font-size: 14px;">
      This invitation will expire in 7 days.
    </p>
  `;

  return {
    subject: `${inviter.name} invited you to join ${organization.name}`,
    html: emailLayout(content, `Join ${organization.name} on ${APP_NAME}`),
    text: `${inviter.name} invited you to join ${organization.name}.\n\nAccept: ${inviteLink}`,
  };
}

/**
 * Application status email
 */
export function applicationStatusEmail(
  user: { name: string },
  program: { name: string; id: string },
  status: 'approved' | 'rejected' | 'pending',
  message?: string
): { subject: string; html: string; text: string } {
  const statusConfig = {
    approved: {
      title: 'Application Approved!',
      color: '#10b981',
      icon: '✓',
      text: 'Congratulations! Your application has been approved. You can now start promoting this program.',
    },
    rejected: {
      title: 'Application Update',
      color: '#ef4444',
      icon: '×',
      text: "Unfortunately, your application was not approved at this time. Don't worry, there are many other great programs available.",
    },
    pending: {
      title: 'Application Received',
      color: '#f59e0b',
      icon: '⏳',
      text: "Your application is being reviewed. We'll notify you once there's an update.",
    },
  };

  const config = statusConfig[status];

  const content = `
    <h2>${config.title}</h2>
    <p>Hi ${user.name || 'there'},</p>

    <div class="card" style="border-left: 4px solid ${config.color};">
      <p class="card-title" style="color: ${config.color};">
        <span style="margin-right: 8px;">${config.icon}</span>
        ${program.name}
      </p>
      <p class="card-text">${config.text}</p>
      ${message ? `<p class="card-text" style="margin-top: 12px; font-style: italic;">"${message}"</p>` : ''}
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${APP_URL}/programs/${program.id}" class="button">View Program</a>
    </div>
  `;

  return {
    subject: `${program.name}: ${config.title}`,
    html: emailLayout(content, `Your application to ${program.name} - ${status}`),
    text: `${config.title}\n\n${program.name}\n${config.text}`,
  };
}

/**
 * Security alert email
 */
export function securityAlertEmail(
  user: { name: string; email: string },
  event: { type: string; device: string; location: string; time: Date }
): { subject: string; html: string; text: string } {
  const content = `
    <h2>Security Alert</h2>
    <p>Hi ${user.name || 'there'},</p>
    <p>We detected a new sign-in to your account:</p>

    <div class="card" style="border-left: 4px solid #f59e0b;">
      <p><strong>Activity:</strong> ${event.type}</p>
      <p><strong>Device:</strong> ${event.device}</p>
      <p><strong>Location:</strong> ${event.location}</p>
      <p><strong>Time:</strong> ${event.time.toLocaleString()}</p>
    </div>

    <p>If this was you, no action is needed. If you don't recognize this activity, please secure your account immediately:</p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="${APP_URL}/settings#security" class="button" style="background-color: #ef4444;">Secure My Account</a>
    </div>
  `;

  return {
    subject: `Security Alert: New sign-in to your account`,
    html: emailLayout(content, 'New sign-in detected on your account'),
    text: `Security Alert\n\nNew ${event.type} detected:\nDevice: ${event.device}\nLocation: ${event.location}\nTime: ${event.time.toLocaleString()}`,
  };
}

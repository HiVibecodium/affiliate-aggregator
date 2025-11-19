/**
 * Unit tests for Email Templates
 * Tests email template generation functions
 */

import { generateNewMatchesEmail } from '@/lib/email/templates/new-matches-alert';
import { generateTeamInviteEmail } from '@/lib/email/templates/team-invite';

describe('Email Templates', () => {
  describe('generateNewMatchesEmail', () => {
    const mockPrograms = [
      {
        id: 'prog_1',
        name: 'Amazon Associates',
        description: 'Join the Amazon Associates Program and monetize your traffic',
        commissionRate: 10,
        commissionType: 'CPA',
        network: {
          name: 'Amazon',
        },
      },
      {
        id: 'prog_2',
        name: 'ShareASale Program',
        description: null,
        commissionRate: 15,
        commissionType: 'Revenue Share',
        network: {
          name: 'ShareASale',
        },
      },
    ];

    it('should generate email with correct subject', () => {
      const result = generateNewMatchesEmail({
        searchName: 'Tech Programs',
        matches: mockPrograms,
        appUrl: 'https://example.com',
        unsubscribeUrl: 'https://example.com/unsubscribe/123',
      });

      expect(result.subject).toBe('🎯 2 новых программ по запросу "Tech Programs"');
    });

    it('should include all programs in HTML', () => {
      const result = generateNewMatchesEmail({
        searchName: 'Tech Programs',
        matches: mockPrograms,
        appUrl: 'https://example.com',
        unsubscribeUrl: 'https://example.com/unsubscribe/123',
      });

      expect(result.html).toContain('Amazon Associates');
      expect(result.html).toContain('ShareASale Program');
      expect(result.html).toContain('Amazon');
      expect(result.html).toContain('ShareASale');
    });

    it('should include commission information', () => {
      const result = generateNewMatchesEmail({
        searchName: 'Tech Programs',
        matches: mockPrograms,
        appUrl: 'https://example.com',
        unsubscribeUrl: 'https://example.com/unsubscribe/123',
      });

      expect(result.html).toContain('10%');
      expect(result.html).toContain('CPA');
      expect(result.html).toContain('15%');
      expect(result.html).toContain('Revenue Share');
    });

    it('should include program links', () => {
      const result = generateNewMatchesEmail({
        searchName: 'Tech Programs',
        matches: mockPrograms,
        appUrl: 'https://example.com',
        unsubscribeUrl: 'https://example.com/unsubscribe/123',
      });

      expect(result.html).toContain('https://example.com/programs/prog_1');
      expect(result.html).toContain('https://example.com/programs/prog_2');
    });

    it('should include unsubscribe link', () => {
      const result = generateNewMatchesEmail({
        searchName: 'Tech Programs',
        matches: mockPrograms,
        appUrl: 'https://example.com',
        unsubscribeUrl: 'https://example.com/unsubscribe/123',
      });

      expect(result.html).toContain('https://example.com/unsubscribe/123');
      expect(result.html).toContain('Отключить уведомления');
    });

    it('should include search name in content', () => {
      const result = generateNewMatchesEmail({
        searchName: 'Tech Programs',
        matches: mockPrograms,
        appUrl: 'https://example.com',
        unsubscribeUrl: 'https://example.com/unsubscribe/123',
      });

      expect(result.html).toContain('Tech Programs');
    });

    it('should handle programs without description', () => {
      const result = generateNewMatchesEmail({
        searchName: 'Test',
        matches: [mockPrograms[1]], // Program without description
        appUrl: 'https://example.com',
        unsubscribeUrl: 'https://example.com/unsubscribe/123',
      });

      expect(result.html).toContain('ShareASale Program');
      expect(result.html).not.toContain(
        '<p style="margin-top: 10px; font-size: 14px; color: #4b5563;">null'
      );
    });

    it('should truncate long descriptions', () => {
      const longDescription = 'A'.repeat(200);
      const programWithLongDesc = {
        ...mockPrograms[0],
        description: longDescription,
      };

      const result = generateNewMatchesEmail({
        searchName: 'Test',
        matches: [programWithLongDesc],
        appUrl: 'https://example.com',
        unsubscribeUrl: 'https://example.com/unsubscribe/123',
      });

      // Should truncate to 150 chars + "..."
      expect(result.html).toContain('A'.repeat(150) + '...');
      expect(result.html).not.toContain('A'.repeat(151));
    });

    it('should handle multiple programs correctly', () => {
      const manyPrograms = Array(5)
        .fill(null)
        .map((_, i) => ({
          id: `prog_${i}`,
          name: `Program ${i}`,
          description: `Description ${i}`,
          commissionRate: 10 + i,
          commissionType: 'CPA',
          network: { name: `Network ${i}` },
        }));

      const result = generateNewMatchesEmail({
        searchName: 'Test',
        matches: manyPrograms,
        appUrl: 'https://example.com',
        unsubscribeUrl: 'https://example.com/unsubscribe/123',
      });

      expect(result.subject).toBe('🎯 5 новых программ по запросу "Test"');
      manyPrograms.forEach((prog) => {
        expect(result.html).toContain(prog.name);
      });
    });

    it('should encode search name in URL', () => {
      const result = generateNewMatchesEmail({
        searchName: 'Tech & Software',
        matches: mockPrograms,
        appUrl: 'https://example.com',
        unsubscribeUrl: 'https://example.com/unsubscribe/123',
      });

      expect(result.html).toContain(encodeURIComponent('Tech & Software'));
    });
  });

  describe('generateTeamInviteEmail', () => {
    it('should generate invite email with correct subject', () => {
      const result = generateTeamInviteEmail({
        inviterName: 'John Doe',
        organizationName: 'Acme Corp',
        role: 'member',
        acceptUrl: 'https://example.com/invite/token123',
        appUrl: 'https://example.com',
      });

      expect(result.subject).toBe('👥 Приглашение в команду "Acme Corp"');
    });

    it('should include inviter name', () => {
      const result = generateTeamInviteEmail({
        inviterName: 'John Doe',
        organizationName: 'Acme Corp',
        role: 'member',
        acceptUrl: 'https://example.com/invite/token123',
        appUrl: 'https://example.com',
      });

      expect(result.html).toContain('John Doe');
    });

    it('should include organization name', () => {
      const result = generateTeamInviteEmail({
        inviterName: 'John Doe',
        organizationName: 'Acme Corp',
        role: 'member',
        acceptUrl: 'https://example.com/invite/token123',
        appUrl: 'https://example.com',
      });

      expect(result.html).toContain('Acme Corp');
    });

    it('should include invite URL', () => {
      const result = generateTeamInviteEmail({
        inviterName: 'John Doe',
        organizationName: 'Acme Corp',
        role: 'member',
        acceptUrl: 'https://example.com/invite/token123',
        appUrl: 'https://example.com',
      });

      expect(result.html).toContain('https://example.com/invite/token123');
    });

    it('should display correct role - member', () => {
      const result = generateTeamInviteEmail({
        inviterName: 'John Doe',
        organizationName: 'Acme Corp',
        role: 'member',
        acceptUrl: 'https://example.com/invite/token123',
        appUrl: 'https://example.com',
      });

      expect(result.html).toContain('Участник');
    });

    it('should display correct role - admin', () => {
      const result = generateTeamInviteEmail({
        inviterName: 'John Doe',
        organizationName: 'Acme Corp',
        role: 'admin',
        acceptUrl: 'https://example.com/invite/token123',
        appUrl: 'https://example.com',
      });

      expect(result.html).toContain('Администратор');
    });

    it('should display correct role - viewer', () => {
      const result = generateTeamInviteEmail({
        inviterName: 'John Doe',
        organizationName: 'Acme Corp',
        role: 'viewer',
        acceptUrl: 'https://example.com/invite/token123',
        appUrl: 'https://example.com',
      });

      expect(result.html).toContain('Наблюдатель');
    });

    it('should display correct role - manager', () => {
      const result = generateTeamInviteEmail({
        inviterName: 'John Doe',
        organizationName: 'Acme Corp',
        role: 'manager',
        acceptUrl: 'https://example.com/invite/token123',
        appUrl: 'https://example.com',
      });

      expect(result.html).toContain('Менеджер');
    });

    it('should include role permissions description', () => {
      const result = generateTeamInviteEmail({
        inviterName: 'John Doe',
        organizationName: 'Acme Corp',
        role: 'admin',
        acceptUrl: 'https://example.com/invite/token123',
        appUrl: 'https://example.com',
      });

      // Check for permissions descriptions
      expect(result.html).toContain('Полный доступ');
    });

    it('should include accept button', () => {
      const result = generateTeamInviteEmail({
        inviterName: 'John Doe',
        organizationName: 'Acme Corp',
        role: 'member',
        acceptUrl: 'https://example.com/invite/token123',
        appUrl: 'https://example.com',
      });

      expect(result.html).toContain('Принять приглашение');
    });

    it('should be valid HTML structure', () => {
      const result = generateTeamInviteEmail({
        inviterName: 'John Doe',
        organizationName: 'Acme Corp',
        role: 'member',
        acceptUrl: 'https://example.com/invite/token123',
        appUrl: 'https://example.com',
      });

      expect(result.html).toContain('<!DOCTYPE html>');
      expect(result.html).toContain('<html>');
      expect(result.html).toContain('</html>');
      expect(result.html).toContain('<body>');
      expect(result.html).toContain('</body>');
    });
  });
});

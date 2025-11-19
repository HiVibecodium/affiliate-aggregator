/**
 * Unit tests for Organizations API routes
 * Tests route handlers with mocked dependencies
 */

import { NextRequest } from 'next/server';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    organization: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    organizationMember: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
  },
}));

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
    },
  })),
}));

describe('Organizations API', () => {
  let prismaMock: any;
  let supabaseMock: any;

  beforeEach(() => {
    jest.clearAllMocks();
    prismaMock = require('@/lib/prisma').prisma;
    const { createClient } = require('@/lib/supabase/server');
    supabaseMock = createClient();
  });

  describe('GET /api/organizations', () => {
    it('should return user organizations', async () => {
      // Mock authenticated user
      supabaseMock.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user_123' } },
        error: null,
      });

      // Mock organizations
      prismaMock.organizationMember.findMany.mockResolvedValue([
        {
          id: 'member_1',
          role: 'owner',
          status: 'active',
          organization: {
            id: 'org_1',
            name: 'Test Org',
            slug: 'test-org',
            tier: 'free',
            memberCount: 1,
          },
          createdAt: new Date('2024-01-01'),
        },
      ]);

      // Dynamic import
      const { GET } = await import('@/app/api/organizations/route');
      const request = new NextRequest('http://localhost:3000/api/organizations');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.organizations).toHaveLength(1);
      expect(data.organizations[0].id).toBe('org_1');
      expect(data.organizations[0].role).toBe('owner');
    });

    it('should return 401 for unauthenticated user', async () => {
      supabaseMock.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      const { GET } = await import('@/app/api/organizations/route');
      const request = new NextRequest('http://localhost:3000/api/organizations');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/organizations', () => {
    it('should create organization with owner role', async () => {
      supabaseMock.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user_123' } },
        error: null,
      });

      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user_123',
        email: 'test@example.com',
      });

      const newOrg = {
        id: 'org_new',
        name: 'New Organization',
        slug: 'new-org',
        tier: 'free',
        memberCount: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.organization.create.mockResolvedValue({
        ...newOrg,
        members: [
          {
            id: 'member_1',
            userId: 'user_123',
            role: 'owner',
            status: 'active',
          },
        ],
      });

      prismaMock.auditLog.create.mockResolvedValue({
        id: 'audit_1',
        action: 'organization_created',
      });

      const { POST } = await import('@/app/api/organizations/route');
      const request = new NextRequest('http://localhost:3000/api/organizations', {
        method: 'POST',
        body: JSON.stringify({
          name: 'New Organization',
          slug: 'new-org',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.name).toBe('New Organization');
      expect(prismaMock.organization.create).toHaveBeenCalled();
      expect(prismaMock.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            action: 'organization_created',
            performedBy: 'user_123',
          }),
        })
      );
    });

    it('should validate organization name', async () => {
      supabaseMock.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user_123' } },
        error: null,
      });

      const { POST } = await import('@/app/api/organizations/route');
      const request = new NextRequest('http://localhost:3000/api/organizations', {
        method: 'POST',
        body: JSON.stringify({
          name: '',
          slug: 'test',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/organizations/[orgId]', () => {
    it('should return organization details', async () => {
      supabaseMock.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user_123' } },
        error: null,
      });

      prismaMock.organizationMember.findFirst.mockResolvedValue({
        id: 'member_1',
        role: 'owner',
        status: 'active',
      });

      prismaMock.organization.findUnique.mockResolvedValue({
        id: 'org_1',
        name: 'Test Org',
        slug: 'test-org',
        tier: 'pro',
        subscriptionStatus: 'active',
        description: 'Test description',
        logo: null,
        website: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      prismaMock.organizationMember.count.mockResolvedValue(5);

      const { GET } = await import('@/app/api/organizations/[orgId]/route');
      const request = new NextRequest('http://localhost:3000/api/organizations/org_1');
      const response = await GET(request, { params: Promise.resolve({ orgId: 'org_1' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe('org_1');
      expect(data.memberCount).toBe(5);
    });

    it('should return 403 for non-member', async () => {
      supabaseMock.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user_123' } },
        error: null,
      });

      prismaMock.organizationMember.findFirst.mockResolvedValue(null);

      const { GET } = await import('@/app/api/organizations/[orgId]/route');
      const request = new NextRequest('http://localhost:3000/api/organizations/org_1');
      const response = await GET(request, { params: Promise.resolve({ orgId: 'org_1' }) });

      expect(response.status).toBe(403);
    });
  });

  describe('PUT /api/organizations/[orgId]', () => {
    it('should update organization (owner only)', async () => {
      supabaseMock.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user_123' } },
        error: null,
      });

      prismaMock.organizationMember.findFirst.mockResolvedValue({
        id: 'member_1',
        role: 'owner',
        status: 'active',
      });

      prismaMock.organization.update.mockResolvedValue({
        id: 'org_1',
        name: 'Updated Name',
        slug: 'test-org',
        tier: 'pro',
        description: 'Updated description',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      prismaMock.auditLog.create.mockResolvedValue({
        id: 'audit_1',
      });

      const { PUT } = await import('@/app/api/organizations/[orgId]/route');
      const request = new NextRequest('http://localhost:3000/api/organizations/org_1', {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Updated Name',
          description: 'Updated description',
        }),
      });

      const response = await PUT(request, { params: Promise.resolve({ orgId: 'org_1' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe('Updated Name');
      expect(prismaMock.organization.update).toHaveBeenCalled();
    });

    it('should return 403 for non-owner', async () => {
      supabaseMock.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user_123' } },
        error: null,
      });

      prismaMock.organizationMember.findFirst.mockResolvedValue({
        id: 'member_1',
        role: 'member',
        status: 'active',
      });

      const { PUT } = await import('@/app/api/organizations/[orgId]/route');
      const request = new NextRequest('http://localhost:3000/api/organizations/org_1', {
        method: 'PUT',
        body: JSON.stringify({
          name: 'Updated Name',
        }),
      });

      const response = await PUT(request, { params: Promise.resolve({ orgId: 'org_1' }) });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/organizations/[orgId]/members', () => {
    it('should return organization members', async () => {
      supabaseMock.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user_123' } },
        error: null,
      });

      prismaMock.organizationMember.findFirst.mockResolvedValue({
        id: 'member_1',
        role: 'admin',
        status: 'active',
      });

      prismaMock.organizationMember.findMany.mockResolvedValue([
        {
          id: 'member_1',
          userId: 'user_123',
          role: 'owner',
          status: 'active',
          user: {
            name: 'Test User',
            email: 'test@example.com',
          },
          createdAt: new Date(),
        },
        {
          id: 'member_2',
          userId: 'user_456',
          role: 'member',
          status: 'active',
          user: {
            name: 'Another User',
            email: 'another@example.com',
          },
          createdAt: new Date(),
        },
      ]);

      const { GET } = await import('@/app/api/organizations/[orgId]/members/route');
      const request = new NextRequest('http://localhost:3000/api/organizations/org_1/members');
      const response = await GET(request, { params: Promise.resolve({ orgId: 'org_1' }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.members).toHaveLength(2);
      expect(data.members[0].role).toBe('owner');
    });
  });

  describe('POST /api/organizations/[orgId]/members', () => {
    it('should invite member (admin/owner only)', async () => {
      supabaseMock.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user_123' } },
        error: null,
      });

      prismaMock.organizationMember.findFirst.mockResolvedValue({
        id: 'member_1',
        role: 'admin',
        status: 'active',
      });

      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user_new',
        email: 'new@example.com',
      });

      prismaMock.organizationMember.create.mockResolvedValue({
        id: 'member_new',
        userId: 'user_new',
        role: 'member',
        status: 'pending',
        createdAt: new Date(),
      });

      prismaMock.auditLog.create.mockResolvedValue({
        id: 'audit_1',
      });

      const { POST } = await import('@/app/api/organizations/[orgId]/members/route');
      const request = new NextRequest('http://localhost:3000/api/organizations/org_1/members', {
        method: 'POST',
        body: JSON.stringify({
          email: 'new@example.com',
          role: 'member',
        }),
      });

      const response = await POST(request, { params: Promise.resolve({ orgId: 'org_1' }) });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.email).toBe('new@example.com');
    });
  });

  describe('DELETE /api/organizations/[orgId]/members/[memberId]', () => {
    it('should remove member (admin/owner only)', async () => {
      supabaseMock.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user_123' } },
        error: null,
      });

      prismaMock.organizationMember.findFirst
        .mockResolvedValueOnce({
          id: 'member_admin',
          role: 'admin',
          status: 'active',
        })
        .mockResolvedValueOnce({
          id: 'member_2',
          userId: 'user_456',
          role: 'member',
          status: 'active',
        });

      prismaMock.organizationMember.delete.mockResolvedValue({
        id: 'member_2',
      });

      prismaMock.auditLog.create.mockResolvedValue({
        id: 'audit_1',
      });

      const { DELETE } = await import('@/app/api/organizations/[orgId]/members/[memberId]/route');
      const request = new NextRequest(
        'http://localhost:3000/api/organizations/org_1/members/member_2'
      );
      const response = await DELETE(request, {
        params: Promise.resolve({ orgId: 'org_1', memberId: 'member_2' }),
      });

      expect(response.status).toBe(200);
      expect(prismaMock.organizationMember.delete).toHaveBeenCalledWith({
        where: { id: 'member_2' },
      });
    });

    it('should prevent removing the only owner', async () => {
      supabaseMock.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user_123' } },
        error: null,
      });

      prismaMock.organizationMember.findFirst
        .mockResolvedValueOnce({
          id: 'member_owner',
          role: 'owner',
          status: 'active',
        })
        .mockResolvedValueOnce({
          id: 'member_owner',
          userId: 'user_123',
          role: 'owner',
          status: 'active',
        });

      prismaMock.organizationMember.count.mockResolvedValue(1);

      const { DELETE } = await import('@/app/api/organizations/[orgId]/members/[memberId]/route');
      const request = new NextRequest(
        'http://localhost:3000/api/organizations/org_1/members/member_owner'
      );
      const response = await DELETE(request, {
        params: Promise.resolve({ orgId: 'org_1', memberId: 'member_owner' }),
      });

      expect(response.status).toBe(400);
    });
  });
});

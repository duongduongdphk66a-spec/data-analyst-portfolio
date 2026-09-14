import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { generateAdminToken } from '@/app/lib/auth';
import {
  getProfileWithFallback,
  getProjectsWithFallback,
  getProjectByIdWithFallback,
  getTextsWithFallback,
  getKamiElyDataWithFallback,
} from '@/app/lib/serverData';
import { POST as handleProfilePost, GET as handleProfileGet } from '@/app/api/profile/route';
import { POST as handleProjectsPost, GET as handleProjectsGet } from '@/app/api/projects/route';
import { POST as handleTextsPost, GET as handleTextsGet } from '@/app/api/texts/route';
import { GET as handleKamiElyGet } from '@/app/api/case-studies/kami-ely/route';

describe('CMS Admin API & Server Data Security', () => {
  describe('Authentication Enforcement on CMS Write Endpoints', () => {
    it('should reject POST /api/profile without Authorization header', async () => {
      const req = new NextRequest('http://localhost:3000/api/profile', {
        method: 'POST',
        body: JSON.stringify({ name: 'Hacked Name' }),
      });

      const res = await handleProfilePost(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('should reject POST /api/profile with an invalid or tampered token', async () => {
      const req = new NextRequest('http://localhost:3000/api/profile', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer invalid_admin_token_xyz',
        },
        body: JSON.stringify({ name: 'Hacked Name' }),
      });

      const res = await handleProfilePost(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('should reject POST /api/projects without Authorization header', async () => {
      const req = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify([{ id: 'fake-proj', title: 'Fake' }]),
      });

      const res = await handleProjectsPost(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('should reject POST /api/texts without Authorization header', async () => {
      const req = new NextRequest('http://localhost:3000/api/texts', {
        method: 'POST',
        body: JSON.stringify([{ text_key: 'hero_title', lang: 'vi', value_text: 'Hacked' }]),
      });

      const res = await handleTextsPost(req);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.success).toBe(false);
    });

    it('should authenticate with a valid generated admin token', async () => {
      const validToken = generateAdminToken();
      const req = new NextRequest('http://localhost:3000/api/profile', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
        body: JSON.stringify({ name: 'Admin Test User' }),
      });

      const res = await handleProfilePost(req);
      // Status should NOT be 401 (might be 200 or 503/fallback depending on DB connection)
      expect(res.status).not.toBe(401);
    });
  });

  describe('Server Data Fallback Helpers', () => {
    it('getProfileWithFallback should return valid profile data with name and skills', async () => {
      const profile = await getProfileWithFallback();
      expect(profile).toBeDefined();
      expect(profile).toHaveProperty('name');
      expect(profile).toHaveProperty('skills');
      expect(Array.isArray(profile.skills)).toBe(true);
    });

    it('getProjectsWithFallback should return non-empty projects list', async () => {
      const projects = await getProjectsWithFallback();
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
      expect(projects[0]).toHaveProperty('id');
      expect(projects[0]).toHaveProperty('title');
    });

    it('getProjectByIdWithFallback should return the project if ID matches', async () => {
      const kamiProject = await getProjectByIdWithFallback('proj-kami-ely');
      expect(kamiProject).toBeDefined();
      expect(kamiProject?.id).toBe('proj-kami-ely');
      expect(kamiProject?.title).toContain('Kami Ely');
    });

    it('getProjectByIdWithFallback should return undefined for nonexistent project', async () => {
      const nonexistent = await getProjectByIdWithFallback('non-existent-project-xyz');
      expect(nonexistent).toBeUndefined();
    });

    it('getTextsWithFallback should return translation dictionaries', async () => {
      const allTexts = await getTextsWithFallback();
      expect(allTexts).toHaveProperty('vi');
      expect(allTexts).toHaveProperty('en');

      const viTexts = await getTextsWithFallback('vi');
      expect(viTexts).toHaveProperty('nav_home');
    });

    it('getKamiElyDataWithFallback should return weekly trends, top SKUs, and top affiliates', async () => {
      const kamiData = await getKamiElyDataWithFallback();
      expect(kamiData).toHaveProperty('weeklyTrends');
      expect(kamiData).toHaveProperty('topSkus');
      expect(kamiData).toHaveProperty('topAffiliates');
      expect(Array.isArray(kamiData.weeklyTrends)).toBe(true);
      expect(kamiData.weeklyTrends.length).toBeGreaterThan(0);
    });
  });

  describe('Public GET Endpoints Resilience', () => {
    it('GET /api/profile should return 200 with profile data even without DB', async () => {
      const res = await handleProfileGet();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data).toHaveProperty('name');
    });

    it('GET /api/projects should return 200 with projects array', async () => {
      const res = await handleProjectsGet();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);
    });

    it('GET /api/texts should return 200 with translations dictionary', async () => {
      const req = new NextRequest('http://localhost:3000/api/texts?lang=vi');
      const res = await handleTextsGet(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data).toHaveProperty('nav_home');
    });

    it('GET /api/case-studies/kami-ely should return 200 with TikTok telemetry data', async () => {
      const res = await handleKamiElyGet();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data).toHaveProperty('weeklyTrends');
      expect(json.data).toHaveProperty('topSkus');
      expect(json.data).toHaveProperty('topAffiliates');
    });
  });
});

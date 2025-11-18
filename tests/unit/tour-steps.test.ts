/**
 * Unit tests for tour steps configuration
 */

import { tourSteps } from '@/lib/tour/tour-steps';

describe('Tour Steps', () => {
  it('should be an array', () => {
    expect(Array.isArray(tourSteps)).toBe(true);
  });

  it('should have multiple steps', () => {
    expect(tourSteps.length).toBeGreaterThan(0);
  });

  it('should have required properties for each step', () => {
    tourSteps.forEach((step) => {
      expect(step).toHaveProperty('id');
      expect(step).toHaveProperty('text');

      expect(typeof step.id).toBe('string');
      expect(typeof step.text).toBe('string');
    });
  });

  it('should have unique IDs', () => {
    const ids = tourSteps.map((step) => step.id);
    const uniqueIds = new Set(ids);

    expect(ids.length).toBe(uniqueIds.size);
  });

  it('should have non-empty text', () => {
    tourSteps.forEach((step) => {
      expect(step.text.length).toBeGreaterThan(0);
    });
  });

  it('should have buttons configured', () => {
    tourSteps.forEach((step) => {
      if (step.buttons) {
        expect(Array.isArray(step.buttons)).toBe(true);
      }
    });
  });

  it('should have attachTo configuration where applicable', () => {
    const stepsWithAttach = tourSteps.filter((step) => step.attachTo);

    stepsWithAttach.forEach((step) => {
      expect(step.attachTo).toHaveProperty('element');
      if (typeof step.attachTo.element === 'string') {
        expect(step.attachTo.element.length).toBeGreaterThan(0);
      }
    });
  });

  it('should have valid when conditions if specified', () => {
    const stepsWithWhen = tourSteps.filter((step) => step.when);

    stepsWithWhen.forEach((step) => {
      if (step.when) {
        expect(step.when).toHaveProperty('show');
        expect(typeof step.when.show).toBe('function');
      }
    });
  });

  it('should have reasonable number of steps', () => {
    // Tour should not be too long or too short
    expect(tourSteps.length).toBeGreaterThanOrEqual(3);
    expect(tourSteps.length).toBeLessThanOrEqual(15);
  });

  it('should have step IDs in consistent format', () => {
    tourSteps.forEach((step) => {
      // IDs should be kebab-case or camelCase
      expect(step.id).toMatch(/^[a-z][a-z0-9-]*$/);
    });
  });
});

import type { ProductCategory } from '../data/apexData';

export interface CrankKinematics {
  pistonOffset: number;
  rodAngleRad: number;
}

export interface EngineStageInfo {
  stageIndex: 0 | 1 | 2;
  stageProgress: number;
  rpmFactor: number;
  oilFlowSpeed: number;
}

export interface ContactInquiryInput {
  name: string;
  email: string;
  company: string;
  category: string;
  message: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactInquiryInput, string>>;
}

/**
 * Computes exact slider-crank piston displacement and connecting-rod tilt angle
 * relative to top-dead-center equilibrium for the 3D engine assembly.
 */
export function calculateCrankKinematics(
  crankAngleRad: number,
  crankRadius: number,
  rodLength: number,
): CrankKinematics {
  const safeRod = Math.max(rodLength, crankRadius * 1.25);
  const pinX = Math.sin(crankAngleRad) * crankRadius;
  const pinY = Math.cos(crankAngleRad) * crankRadius;
  const underRoot = Math.max(0.0001, safeRod * safeRod - pinX * pinX);
  const pistonY = pinY + Math.sqrt(underRoot);
  const rodAngleRad = Math.atan2(pinX, Math.sqrt(underRoot));
  return {
    pistonOffset: pistonY - safeRod,
    rodAngleRad,
  };
}

/**
 * Maps normalized scroll progress [0, 1] across Section 2 into the 3 narrative chapters
 * and calibrated mechanical animation parameters.
 */
export function getEngineStageFromProgress(progress: number): EngineStageInfo {
  const clamped = Math.max(0, Math.min(1, progress));
  if (clamped < 0.34) {
    return {
      stageIndex: 0,
      stageProgress: clamped / 0.34,
      rpmFactor: 0.75 + (clamped / 0.34) * 0.45,
      oilFlowSpeed: 0.8 + (clamped / 0.34) * 0.5,
    };
  }
  if (clamped < 0.68) {
    const local = (clamped - 0.34) / 0.34;
    return {
      stageIndex: 1,
      stageProgress: local,
      rpmFactor: 1.2 + local * 0.6,
      oilFlowSpeed: 1.3 + local * 0.6,
    };
  }
  const local = (clamped - 0.68) / 0.32;
  return {
    stageIndex: 2,
    stageProgress: local,
    rpmFactor: 1.8 - local * 0.35,
    oilFlowSpeed: 1.9 - local * 0.25,
  };
}

/**
 * Filters verified Apex Lubes product categories by keyword across titles,
 * technical labels, viscosity grades, and applications.
 */
export function filterProductsByQuery(
  products: ProductCategory[],
  rawQuery: string,
): ProductCategory[] {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return products;
  return products.filter((item) => {
    const haystack = [
      item.title,
      item.shortTitle,
      item.technicalLabel,
      item.description,
      ...item.specifications,
      ...item.applications,
      ...item.viscosityGrades,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates contact/specification inquiry inputs without bypassing empty or invalid fields.
 */
export function validateContactInquiry(
  input: ContactInquiryInput,
): ContactValidationResult {
  const errors: Partial<Record<keyof ContactInquiryInput, string>> = {};

  if (input.name.trim().length < 2) {
    errors.name = 'Please enter your full name (at least 2 characters).';
  }
  if (!EMAIL_REGEX.test(input.email.trim())) {
    errors.email = 'Please enter a valid business or personal email address.';
  }
  if (input.message.trim().length < 10) {
    errors.message = 'Please describe your lubricant grade, volume, or application requirement (at least 10 characters).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

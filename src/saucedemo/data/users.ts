export const sauceDemoUsers = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user'
} as const;

export const standardUser = sauceDemoUsers.standard;
export const lockedOutUser = sauceDemoUsers.lockedOut;

export const shoppingUsers = [
  sauceDemoUsers.standard,
  sauceDemoUsers.problem,
  sauceDemoUsers.performanceGlitch,
  sauceDemoUsers.error,
  sauceDemoUsers.visual
];

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const usersPassword = getRequiredEnv('USERS_PASSWORD');

export const defaultCustomer = {
  firstName: 'Alex',
  lastName: 'Tester',
  postalCode: '10001'
};

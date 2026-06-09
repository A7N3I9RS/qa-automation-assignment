export const standardUser = 'standard_user';
export const lockedOutUser = 'locked_out_user';

export const shoppingUsers = [
  standardUser,
  'problem_user',
  'performance_glitch_user',
  'error_user',
  'visual_user'
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

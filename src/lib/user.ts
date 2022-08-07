import { User } from "types/DTOs";

/**
 * Generates the profile path of a user
 * @param user The user to generate the path for
 * @returns The profile path of the given user
 */
const getProfilePath = (user: User) => {
  return `${user.email.replace(/  +/g, "-")}--${user.id}`;
};

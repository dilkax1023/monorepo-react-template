import { getId } from '@reactkit/entities-utils/shared/getId'
import { User } from '@reactkit/entities/User'

export const getUserInitialFields = ({
  email,
  name,
  country,
}: Pick<User, 'email' | 'name' | 'country'>): Omit<User, 'updatedAt'> => {
  return {
    id: getId(),
    createdAt: Date.now(),
    email,
    name,
    country,
  }
}

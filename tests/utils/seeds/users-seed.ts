import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'

import { loadEnv } from '../../../src/config/environment-variables'

const { JWT_SECRET } = loadEnv()

export const userSeeds = [
  {
    _id: new ObjectId('64ae0db703b87ae1f00f6f01'),
    username: 'validUser',
    password: Bun.password.hashSync('ValidPass123!!'),
    token: jwt.sign(
      { userId: '64ae0db703b87ae1f00f6f01' },
      JWT_SECRET,
      { expiresIn: '1h' }, // valid for 1 hour
    ),
  },
  {
    _id: new ObjectId('64ae0db703b87ae1f00f6f02'),
    username: 'noTokenUser',
    password: Bun.password.hashSync('NoToken123!'),
    token: null, // no token assigned
  },
  {
    _id: new ObjectId('64ae0db703b87ae1f00f6f03'),
    username: 'expiredUser',
    password: Bun.password.hashSync('Expired123!'),
    token: jwt.sign(
      { userId: '64ae0db703b87ae1f00f6f03' },
      JWT_SECRET,
      { expiresIn: '-1h' }, // already expired
    ),
  },
  {
    _id: new ObjectId('64ae0db703b87ae1f00f6f04'),
    username: 'deletedUser',
    password: Bun.password.hashSync('Expired123!'),
    token: jwt.sign({ userId: '64ae0db703b87ae1f00f6f04' }, JWT_SECRET, {
      expiresIn: '1h',
    }),
    deletedAt: new Date().toISOString(),
  },
]

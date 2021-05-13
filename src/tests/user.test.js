import {User} from '../models/user.js';
import jwt from 'jsonwebtoken';

describe('user.generateAuthToken', () => {
  it('should return valid JWT token', () => {
    const user = new User({ _id: 1 });
    const token = user.generateAuthToken();
    const decode = jwt.verify(token, process.env.JWT_KEY);

    expect(decode).toMatchObject({ _id: 1 })
  })
})
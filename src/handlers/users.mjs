import { matchedData, validationResult } from 'express-validator';
import { hashPassword } from '../utils/helpers.mjs';
import { User } from '../mongoose/schemas/user.mjs';
import { mockUsers } from '../utils/constants.mjs';

export function getUserByIdHandler(req, res) {
  const { findUserIndex } = req;

  const findUser = mockUsers[findUserIndex];

  if (!findUser) {
    return res.sendStatus(404);
  };

  return res.send(findUser);
};

export async function createUserHandler(req, res) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).send(result.array());
  };

  const data = matchedData(req);

  data.password = hashPassword(data.password);

  const newUser = new User(data);
  try {
    const savedUser = await newUser.save();
    return res.status(201).send(savedUser);
  } catch (err) {
    console.error(err);
    return res.sendStatus(400);
  };
};
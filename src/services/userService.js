const { Op } = require('sequelize');
const models = require('../models');

/**
 * 회원가입 서비스
 * @param {String} userId
 * @param {String} encryptPassword
 * @param {String} salt
 * @returns {Object} 가입한 유저 정보 { userId, password, salt }
 */
exports.signup = async (userId, encryptPassword, salt) => {
  try {
    const newUser = await models.user.create({
      id: userId,
      password: encryptPassword,
      salt,
    });
    return newUser;
  } catch (err) {
    throw err;
  }
};

/**
 * 유저 체크 서비스
 * @param {String} userId
 * @returns {Object} 이미 존재하는 유저 정보 { username, domain, password, isAdmin, salt, refreshToken, createdAt, updatedAt }
 */
exports.checkUser = async userId => {
  try {
    const alreadyUser = await models.user.findOne({
      where: {
        id: userId,
      },
    });
    return alreadyUser;
  } catch (err) {
    throw err;
  }
};

/**
 * 로그인 서비스
 * @param {String} userId
 * @param {String} password
 * @returns {Object} 로그인한 유저 정보 { id, password, salt }
 */
exports.signin = async (userId, password) => {
  try {
    const user = await models.user.findOne({
      where: {
        id: userId,
        password,
      },
    });

    return user;
  } catch (err) {
    throw err;
  }
};

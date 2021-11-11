const models = require('../models');
const logger = require('../utils/logger');

/**
 * 회원가입 서비스
 * @param {String} id
 * @param {String} encryptPassword
 * @param {String} salt
 * @returns {Object} 가입한 유저 정보 { userId, password, salt }
 */
exports.signup = async (id, encryptPassword, salt) => {
  try {
    const newUser = await models.user.create({
      id,
      password: encryptPassword,
      salt,
    });
    return newUser;
  } catch (err) {
    throw err;
  }
};

/**
 * 이메일 체크 서비스
 * @param {String} id
 * @returns {Object} 이미 존재하는 유저 정보 { username, domain, password, isAdmin, salt, refreshToken, createdAt, updatedAt }
 */
exports.checkUser = async id => {
  try {
    const alreadyUser = await models.user.findOne({
      id,
    });
    return alreadyUser;
  } catch (err) {
    throw err;
  }
};

/**
 * 로그인 서비스
 * @param {String} id
 * @param {String} password
 * @returns {Object} 로그인한 유저 정보 { id, password, salt }
 */
exports.signin = async (id, password) => {
  try {
    const user = await models.user.findOne({
      id,
      password,
    });

    return user;
  } catch (err) {
    throw err;
  }
};

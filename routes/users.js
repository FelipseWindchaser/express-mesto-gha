const router = require('express').Router();
const {
  getUsers,
  getUserId,
  createUser,
  refreshProfile,
  refreshProfileAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.post('/', createUser);
router.patch('/me', refreshProfile);
router.patch('/me/avatar', refreshProfileAvatar);

module.exports = router;

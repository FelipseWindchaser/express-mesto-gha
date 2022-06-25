const router = require('express').Router();
const {
  getUsers,
  getUserId,
  refreshProfile,
  refreshProfileAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.patch('/me', refreshProfile);
router.patch('/me/avatar', refreshProfileAvatar);

module.exports = router;

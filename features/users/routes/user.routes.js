const express = require('express');
const UserController = require('../controllers/UserController');
const RoleController = require('../controllers/RoleController');
const PermissionController = require('../controllers/PermissionController');
const { verifyToken } = require('../../../middleware/AuthMiddleware');
const { check } = require('express-validator');

const router = express.Router()
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// ---------- User Routes ---------- //

//Post Method
// router.post('/', verifyToken, [
//     // check('name').not().isEmpty(),
//     // check('email').not().isEmpty(),
//     // check('password').not().isEmpty(),
//     // check('phone').not().isEmpty(),
//     // check('dateOfBirth').not().isEmpty(),
//     // check('address').not().isEmpty(),
//     // check('start_date').not().isEmpty(),
//     // check('note').not().isEmpty(),
//     // check('role_id').not().isEmpty(),
//     // check('job_role').not().isEmpty(),
//     // check('document').not().isEmpty(),
//     // check('photo').not().isEmpty(),
// ], UserController.create);

router.post('/', verifyToken, upload.single('files'),UserController.create)

//Get all Method
router.get('/', verifyToken, UserController.index)

//Get by ID Method
router.get('/:id/show', verifyToken, UserController.show)

//Update by ID Method
// router.put('/:id/update', [
//     // check('name').not().isEmpty(),
//     // check('email').not().isEmpty(),
//     // check('phone').not().isEmpty(),
//     // check('dateOfBirth').not().isEmpty(),
//     // check('address').not().isEmpty(),
//     // check('start_date').not().isEmpty(),
//     // check('note').not().isEmpty(),
//     // check('role_id').not().isEmpty(),
//     // check('job_role').not().isEmpty(),
// ], verifyToken, upload.single('files'), UserController.update)

router.put('/:id/update', verifyToken, upload.single('files'),UserController.update)


//Delete by ID Method
router.delete('/:id/delete', verifyToken, UserController.delete)

// ---------- Permission Routes ---------- //
router.get('/permission/', verifyToken, PermissionController.index)

router.post('/permission/', [
    check('name').not().isEmpty(),
    check('slug').not().isEmpty(),
], verifyToken, PermissionController.create);

router.put('/permission/:id/update', [
    check('name').not().isEmpty(),
    check('slug').not().isEmpty(),
], verifyToken, PermissionController.update);

// ---------- Role Routes ---------- //
router.get('/role/', verifyToken, RoleController.index)

router.post('/role/', [
    check('name').not().isEmpty(),
    check('permissions').not().isEmpty(),
], verifyToken, RoleController.create);

router.put('/role/:id/update', [
    check('name').not().isEmpty(),
    check('permissions').not().isEmpty(),
], verifyToken, RoleController.update);

module.exports = router;
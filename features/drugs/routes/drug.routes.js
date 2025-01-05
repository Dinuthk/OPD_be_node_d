const express = require('express');
const { check } = require('express-validator');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const DrugController = require('../controllers/DrugController');
const { verifyToken } = require('../../../middleware/AuthMiddleware');
const router = express.Router()

router.post('/add-drug',verifyToken,[
    check('name').not().isEmpty(),
    check('form').not().isEmpty(),
    check('strength').not().isEmpty(),
    check('qty').not().isEmpty(),
    check('expiredate').not().isEmpty(),
],upload.single('files'), DrugController.addDrug);

router.get('/',verifyToken, DrugController.getDrugs);

//update drug data
router.put('/:id/update',verifyToken, upload.single('files'), DrugController.updateDrug)


module.exports = router;

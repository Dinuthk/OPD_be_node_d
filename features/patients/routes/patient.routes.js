const express = require('express');
const { check } = require('express-validator');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const PaientController = require('../controllers/PatientController');
const { verifyToken } = require('../../../middleware/AuthMiddleware');
const router = express.Router()

router.post('/add-patient',verifyToken,[
    check('name').not().isEmpty(),
    check('age').not().isEmpty(),
    check('gender').not().isEmpty(),
    check('phone').not().isEmpty(),
    check('address').not().isEmpty(),
    check('queue').not().isEmpty(),
    check('state').not().isEmpty()
],upload.single('files'), PaientController.addPatient);

router.get('/get-patients',verifyToken, PaientController.getPatients);

router.put('/update-prescription',verifyToken,upload.single('files'), PaientController.updatePrescription);

//update patient state
router.put('/update-state',verifyToken,upload.single('files'), PaientController.updatePatientState);

//update patient data
router.put('/:id/update',verifyToken, upload.single('files'), PaientController.updatePatient)

//delete patient
router.delete('/:id/delete',verifyToken, PaientController.deletePatient)

module.exports = router;

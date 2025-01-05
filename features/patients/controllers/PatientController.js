const Patient = require("../models/PatientModel");
const { validationResult } = require("express-validator");


const PaientController = {
    async addPatient(req, res) {
        console.log(req.body);
        // const errors = validationResult(req);

        // if (!errors.isEmpty()) {
        //     return res.status(422).json({
        //         error: true,
        //         message: 'Validation errors',
        //         data: errors,
        //     });
        // }

        const { name, age, gender, phone, address, queue,state} = req.body;

        try {
            const patient = await Patient.findOne({ "phone": phone });

            if (patient) {
                return res.status(400).json({
                    error: true,
                    message: 'patient already exists',
                    data: null,
                });
            }

            const newpatient = new Patient({
                name,
                age,
                gender,
                queue,
                phone,
                address,
                state,
                prescription: {},
                labtest:{}
            });

            await newpatient.save();

            return res.status(200).json({
                error: false,
                message: 'patient created successfully',
                data: newpatient,
            });

        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: true,
                message: 'patient creation failed!',
                data: null,
            });
        }
    },

    async getPatients(req, res) {
        try {
            const patients = await Patient.find({});

            return res.status(200).json({
                error: false,
                message: 'patients fetched successfully',
                data: patients,
            });

        } catch (error) {
            return res.status(400).json({
                error: true,
                message: 'Failed to fetch patients',
                data: null,
            });
        }
    },


    async getPatient(req, res) {
        const { id } = req.params;

        try {
            const patient = await
                Patient.findById(id);

            if (!patient) {
                return res.status(404).json({
                    error: true,
                    message: 'patient not found',
                    data: null,
                });
            }

            return res.status(200).json({
                error: false,
                message: 'patient fetched successfully',
                data: patient,
            });

        } catch (error) {
            return res.status(400).json({
                error: true,
                message: 'Failed to fetch patient',
                data: null,
            });
        }
    },

    //update patient state
    async updatePatientState(req, res) {
        const { id } = req.body;
        const { state } = req.body;
        console.log("id", id, "state", state);

        try {
            const patient = await Patient.findById(id);

            if (!patient) {
                return res.status(404).json({
                    error: true,
                    message: 'patient not found',
                    data: null,
                });
            }

            patient.state = state;
            await patient.save();

            return res.status(200).json({
                error: false,
                message: 'patient state updated successfully',
                data: patient,
            });

        }
        catch (error) {
            return res.status(400).json({
                error: true,
                message: 'Failed to update patient state',
                data: null,
            });
        }
    },

    //update patient data

    async updatePatient(request, response, next) {
        //const errors = validationResult(request);
    
        // if (!errors.isEmpty()) {
        //   return response.status(422).json({
        //     error: true,
        //     message: "Validation errors",
        //     data: errors,
        //   });
        // }
    
        const { name, age, gender, phone, address, queue,state,prescriptions} = request.body;

        console.log("pres",prescriptions);
        try {
    
        //   if (password) {
        //     await User.findByIdAndUpdate(request.params.id, {
        //       password: bcrypt.hashSync(password, 10),
        //     });
        //   }
    
    
    
          const user = await Patient.findByIdAndUpdate(
            request.params.id,
            {
              name,
              age,
              gender,
              phone,
              address,
              queue,
              prescriptions
            },
            { new: true }
          );
          
          console.log(user);

          return response.status(200).json({
            error: false,
            message: "Patient updated!",
            data: user,
          });
        } catch (error) {
          console.log(error);
          return response.status(400).json({
            error: true,
            message: "Failed to update patient!",
            data: null,
          });
        }
      },

    async updatePrescription(req, res) {
        const { id } = req.body;
        const { prescriptions } = req.body;
        console.log("id", id, "prescription", prescriptions);

        try {
            const patient = await Patient.findById(id);

            if (!patient) {
                return res.status(404).json({
                    error: true,
                    message: 'patient not found',
                    data: null,
                });
            }

            patient.prescriptions = prescriptions;
            await patient.save();

            return res.status(200).json({
                error: false,
                message: 'patient prescription updated successfully',
                data: patient,
            });

        }
        catch (error) {
            return res.status(400).json({
                error: true,
                message: 'Failed to update patient prescription',
                data: null,
            });
        }
    },

    async deletePatient(req, res) {
        const { id } = req.params;
        try {
            const patient = await Patient.findByIdAndDelete(id);
    
            if (!patient) {
                return res.status(404).json({
                    error: true,
                    message: 'patient not found',
                    data: null,
                });
            }
    
            return res.status(200).json({
                error: false,
                message: 'patient deleted successfully',
                data: null,
            });
    
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: true,
                message: 'Failed to delete patient',
                data: null,
            });
        }
    },
};

module.exports = PaientController;
// improve logging
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const patientsRoutes = require('./routes/patients');
const labDataRoutes = require('./routes/lab_data');
const labTestResultRoutes = require('./routes/lab_test_result');
const recommendationsRotues = require('./routes/recommendations');
const departmentsRoutes = require('./routes/departments');
const doctorsRoutes = require('./routes/doctors');
const adminsRoutes = require('./routes/admins');
const patientsWDoctors = require('./routes/lab_data-patients-doctors');
const doctorsWDepartments = require('./routes/doctors-departments');
const uploadRoutes = require("./routes/upload-csv");
const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");
const availableSlotsRoute = require("./routes/available_slots");
const appointmentRoute = require("./routes/appointments");
const scheduleRoute = require("./routes/doctor-schedules");
const approvalRoute = require("./routes/appointment-apporval");
const bulkRoute = require("./routes/bulk-upload");
const labTestRoute = require("./routes/lab_tests");
const generateRecommendationRoute = require("./routes/generateRecommendations");
const imageUploadRoute = require("./routes/image_upload");
const detailsRoute = require("./routes/details");
const corse = require('cors');
const db = require('./db'); // import the database connection


require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000; // Use the port from .env or default to 3000

app.use(corse());
// Middleware
app.use(bodyParser.json());

// Routes
app.use('/patients', patientsRoutes);
app.use('/lab-data', labDataRoutes);
app.use('/lab_test_result', labTestResultRoutes);
app.use('/departments', departmentsRoutes);
app.use('/doctors', doctorsRoutes);
app.use('/recommendations', recommendationsRotues);
app.use('/admins', adminsRoutes);
app.use('/patients-with-doctors', patientsWDoctors);
app.use('/doctors-with-departments', doctorsWDepartments);
app.use("/upload", uploadRoutes);
app.use("/login", authRoute);
app.use("/slots", availableSlotsRoute);
app.use("/profile", profileRoute);
app.use('/appointment', appointmentRoute);
app.use('/schedule', scheduleRoute);
app.use('/appointments', approvalRoute);
app.use('/bulk', bulkRoute);
app.use('/lab-tests', labTestRoute);
app.use('/api', generateRecommendationRoute);
app.use('/image', imageUploadRoute);
app.use('/details', detailsRoute);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


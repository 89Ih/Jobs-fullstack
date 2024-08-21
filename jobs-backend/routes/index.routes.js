require('dotenv').config();
const express = require('express');
const router = express.Router();
const { authMSAL } = require('../auth/index')
/* GET home page. */
router.get("/", async function (req, res) {
    return res.status(200).json("Loading ...");
});
/* GET Jobs from Dataverse */
router.get("/jobs", async (req, res) => {
    const items = await authMSAL.fetchJobs();
    try {
        if (items) {
            return res.status(200).json(items);
        } else {
            res.status(500).send('data could not be fetched from Dataverse')
        }
    } catch (error) {
        res.status(500).send(error)
    }
});
/* POST candidate data into Dataverse */
router.post("/application", async (req, res) => {
    const candidateData = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        emailaddress1: req.body.emailaddress1,
        address1_country: req.body.address1_country,
        address1_line1: req.body.address1_line1,
        address1_city: req.body.address1_city,
        address1_postalcode: req.body.address1_postalcode,
        mobilephone: req.body.mobilephone,
        familystatuscode: req.body.familystatuscode,
        gendercode: req.body.gendercode,
        birthdate: req.body.birthdate,
        pr_edu: req.body.pr_edu,
        pr_graduationyear_txt: req.body.pr_graduationyear_txt,
        pr_noticeperiod: req.body.pr_noticeperiod,
        pr_salary: req.body.pr_salary,
        "pr_potentialjob@odata.bind": `/entities(${req.body.pr_potentialjob})`,
    };
    return await authMSAL.createCandidate(candidateData).then((apiRes) => {
        return res.status(201).json(apiRes);
    });
});
module.exports = router;

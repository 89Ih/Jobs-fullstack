require("dotenv").config();
const express = require("express");
const router = express.Router();
const { authMSAL } = require("../auth/index");
const formidable = require("formidable");
const fs = require("fs");
const path = require('path');
/* GET home page. */
router.get("/", async function (req, res) {
  return res.status(200).json("Loading...");
});

/* GET Jobs from Dataverse */
router.get("/jobs", async (req, res) => {
  const items = await authMSAL.fetchJobs();
  try {
    if (items) {
      return res.status(200).json(items);
    } else {
      res.status(500).send("data could not be fetched from Dataverse");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

/* POST candidate data into Dataverse */
router.post("/application", async (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
   var binaryImageData,base64ImageData;
   
    if (Object.keys(files).includes("profile")) {
        binaryImageData = fs.readFileSync(files?.profile[0]?.filepath);
        base64ImageData = Buffer.from(binaryImageData).toString('base64');
    }
    
    const candidateData = {
      firstname: fields.firstname[0],
      lastname: fields.lastname[0],
      emailaddress1: fields.emailaddress1[0],
      mobilephone: fields.mobilephone[0],
      address1_city: fields.address1_city[0],
      address1_country: fields.address1_country[0],
      address1_line1: fields.address1_line1[0],
      address1_postalcode: fields.address1_postalcode[0],
      gendercode: Number(fields.gendercode[0]) || -1,
      birthdate: fields.birthdate[0],
      pr_edu: Number(fields.pr_edu[0]) || -1,
      pr_graduationyear_txt: fields.pr_graduationyear_txt[0],
      pr_noticeperiod: Number(fields.pr_noticeperiod[0]) || -1,
      pr_salary: Number(fields.pr_salary[0]) || null,
      "pr_potentialjob@odata.bind": fields["pr_potentialjob@odata.bind"][0],
      pr_jobopportunity_set: 125620001,
      entityimage:base64ImageData || ""
    };

    return await authMSAL.createCandidate(candidateData).then((apiRes) => {
      const { data, contactId } = apiRes;
      res.status(201).json(data);
      if (Object.keys(files).includes('file') && contactId) {
        return authMSAL.sendFiles(fields, files, contactId)
      }
      return
    });
  });
});
module.exports = router;

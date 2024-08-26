require("dotenv").config();
const express = require("express");
const router = express.Router();
const { authMSAL } = require("../auth/index");
const formidable = require("formidable");

function processFields(fields) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => {
      const processedValue =
        key !== "mobilephone" &&
        key !== "address1_postalcode" &&
        key !== "pr_graduationyear_txt" &&
        !isNaN(value[0])
          ? parseInt(value[0], 10)
          : value[0];
      return [key, processedValue];
    })
  );
}
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
    const obj = processFields(fields);
    return await authMSAL.createCandidate(obj).then((apiRes) => {
      const { data, contactId } = apiRes;
      res.status(201).json(data);
      if (contactId) {
        return authMSAL.sendFiles(fields, files, contactId)
      }
    });
  });
});
module.exports = router;

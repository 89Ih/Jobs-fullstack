require("dotenv").config();
const fs = require("fs");
const axios = require("axios");

const {
  AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET,
  AZURE_SCOPE_URL,
  AZURE_DATAVERSE_URL,
  AZURE_AUTHORITY,
  GRAPH_SCOPE_URL,
  SHARPOINT_DRIVE_ID,
} = process.env;

class AuthMSAL {
  // constructor() {}
  async getAccessToken(scope) {
    let DataverseaccessToken, tokenExpirationTime;
    if (DataverseaccessToken && Date.now() < tokenExpirationTime) {
      return DataverseaccessToken;
    }
    try {
      const response = await axios.post(
        AZURE_AUTHORITY,
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: AZURE_CLIENT_ID,
          client_secret: AZURE_CLIENT_SECRET,
          scope: scope,
        })
      );

      DataverseaccessToken = response.data.access_token;
      tokenExpirationTime = Date.now() + response.data.expires_in * 1000;
      return DataverseaccessToken;
    } catch (error) {
      console.error(
        "Error fetching access token:",
        error.response?.status,
        error.response?.data
      );
      throw new Error("Error fetching access token");
    }
  }
  async fetchJobs() {
    const token = await this.getAccessToken(AZURE_SCOPE_URL);
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const entity = AZURE_DATAVERSE_URL + "/pr_jobs";
      const response = await fetch(entity, requestOptions);
      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.statusText}`);
      }
      const { value: jobs } = await response.json();
      return jobs;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw new Error("Failed to fetch jobs.");
    }
  }
  async createCandidate(candidateData) {
    const token = await this.getAccessToken(AZURE_SCOPE_URL);
    const requestOptions = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const entity = AZURE_DATAVERSE_URL + "/contacts";
    const response = await axios.post(entity, candidateData, requestOptions);
    const data = await response.data;
    const locationHeader = response.headers["location"];
    const contactId = (locationHeader.match(/contacts\(([^)]+)\)/)?.[1] || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");
    const obj = { data, contactId };
    return obj;
  }
  /**
   * @param {File} fileParam
   * @param {string} contactId
   */
  // async root() {
  //   const sharePointAccessToken = await this.getAccessToken(GRAPH_SCOPE_URL);

  //   let URLSiteID =
  //     "https://graph.microsoft.com/v1.0/sites/vxter.sharepoint.com:/sites/attachment";
  //   let URLDriveID =
  //     "https://graph.microsoft.com/v1.0/sites/d9103146-cd31-4f9a-95cb-71663a35a7bd/drives";

  //   const response = await fetch(URLDriveID, {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${sharePointAccessToken}`,
  //     },
  //   });
  //   const data = await response.json();
  //   console.log(data);
  // }
  async sendFiles(fieldsParam, fileParam, contactId) {
    const sharePointAccessToken = await this.getAccessToken(GRAPH_SCOPE_URL);

    const file = fileParam.file;
    const filePath = file[0].filepath;
    const firstname = fieldsParam.firstname[0];
    const lastname = fieldsParam.lastname[0];
    const fullname = firstname + " " + lastname + "_" + contactId;
    const originalFilename = file[0].originalFilename;
    console.log(filePath);
    console.log(originalFilename);
    
    
    try {
      const URL_UPLOAD_TO_SHAREPOINT = `https://graph.microsoft.com/v1.0/drives/${SHARPOINT_DRIVE_ID}/root:/${fullname}/${originalFilename}:/content`;
      const fileBuffer = fs.readFileSync(filePath);

      const response = await fetch(URL_UPLOAD_TO_SHAREPOINT, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sharePointAccessToken}`,
          "Content-Type": "application/json",
        },
        body: fileBuffer,
      });

      console.error(
        `File '${originalFilename}' uploaded and metadata updated successfully`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading files to SharePoint:", error);
    }
  }
}
const authMSAL = new AuthMSAL();
module.exports = { authMSAL };

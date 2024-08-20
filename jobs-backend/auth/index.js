require("dotenv").config();

const axios = require("axios");
const {
  AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET,
  AZURE_SCOPE_URL,
  AZURE_DATAVERSE_URL,
  AZURE_AUTHORITY,
} = process.env;

class AuthMSAL {
  constructor() {}
  async getDataverseAccessToken() {
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
          scope: AZURE_SCOPE_URL,
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
    const token = await this.getDataverseAccessToken();
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
    const token = await this.getDataverseAccessToken();
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const entity = AZURE_DATAVERSE_URL + "/contacts";
    const response = await axios.post(entity, candidateData, requestOptions);
    const data = await response.data;
    return data;
  }
}

const authMSAL = new AuthMSAL();
module.exports = { authMSAL };

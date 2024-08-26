/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
const {
  REACT_APP_URL_JOBS,
  REACT_APP_URL_APPLICANTEN,
  // REACT_APP_URL_PRODUCTION_JOBS,
  // REACT_APP_URL_PRODUCTION_APPLICANTEN,
} = process.env;
class RestService {
  async fetchJobs() {
    try {
      const apiResponse = await axios.get(`${REACT_APP_URL_JOBS}`);
      return apiResponse.data;
    } catch (err) {
      console.error(err);
    }
  }
  async createCandidte(bdy: any ) {
    try {
      const apiResponse = await axios.post(`${REACT_APP_URL_APPLICANTEN}`, bdy,{
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return apiResponse.data;
    } catch (err) {
      console.error(err);
    }
  }
}
const restService = new RestService();
export default restService;

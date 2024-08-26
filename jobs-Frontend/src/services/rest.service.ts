/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse} from 'axios';

const {REACT_APP_URL_JOBS,REACT_APP_URL_APPLICANTEN} = process.env;

class RestService {
  async fetchJobs() {
    try {
      const apiResponse :AxiosResponse = await axios.get(`${REACT_APP_URL_JOBS}`);
      return apiResponse.data;
    } catch (err) {
      console.error(err);
    }
  }
  async createCandidte(bdy: FormData){
    try {
      const apiResponse: AxiosResponse = await axios.post(`${REACT_APP_URL_APPLICANTEN}`, bdy,{
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

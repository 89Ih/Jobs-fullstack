import {ChangeEvent,useCallback,useEffect,useRef,useState} from "react";
import { Button, Checkbox } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { eduData, GenderData, noticePeriodData } from "./_static";
import ApplyForm from "../components/Parts/ApplyForm";
import Options from "../components/Parts/Options";
import Countries from "../components/Parts/Countries";
import restService from "../services/rest.service";
const { GroupField } = ApplyForm;
const { Field } = GroupField;

interface IApplicant {
  firstname?: string;
  lastname?: string;
  emailaddress1?: string;
  address1_country?: string;
  address1_line1?: string;
  address1_city?: string;
  address1_postalcode?: string;
  familystatuscode?: number;
  gendercode?: number;
  birthdate?: string;
  pr_edu?: number;
  pr_graduationyear?: number;
  pr_noticeperiod?: number;
  pr_salary?: number;
  pr_potentialjob?: string | null;
}
export default function Application() {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();
  const JobId: string | undefined = useParams().id;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const JobTitle = urlParams.get("titl");
  const [phoneNumber, setPhoneNumber] = useState<any>({
    countryCode: null,
    tel: null,
  });
  const handleTelNumber = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setPhoneNumber({
        countryCode: paragraphRef.current?.textContent,
        tel: value,
      });
    },
    [ paragraphRef]
  );

  const [applicant, setApplicant] = useState<IApplicant>({
    firstname: "",
    lastname: "",
    emailaddress1: "",
    address1_line1: "",
    address1_country: "",
    address1_city: "",
    address1_postalcode: undefined,
    familystatuscode: undefined,
    gendercode: undefined,
    birthdate: undefined,
    pr_edu: undefined,
    pr_graduationyear: undefined,
    pr_noticeperiod: undefined,
    pr_salary: undefined,
    pr_potentialjob: JobId,
  });

  async function handleSubmit() {
    try {
      const objData = {
        firstname: applicant.firstname,
        lastname: applicant.lastname,
        emailaddress1: applicant.emailaddress1,
        mobilephone: phoneNumber.countryCode+phoneNumber.tel,
        address1_city: applicant.address1_city,
        address1_country: applicant.address1_country,
        address1_line1: applicant.address1_line1,
        address1_postalcode: applicant.address1_postalcode,
        gendercode: applicant.gendercode,
        birthdate: applicant.birthdate,
        pr_edu: applicant.pr_edu,
        pr_graduationyear: applicant.pr_graduationyear,
        pr_noticeperiod: applicant.pr_noticeperiod,
        pr_potentialjob: JobId,
        pr_salary: applicant.pr_salary,
      };
      await restService.createCandidte(objData).then(() => navigate("/Submission"));
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = useCallback(
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
      field: keyof IApplicant
    ) => {
      let value: string | Date | undefined | number = event.target.value;
      setApplicant({ ...applicant, [field]: value });
    },
    [applicant]
  );
  // const [currentFile, setCurrentFile] = useState<File>();
  // const [fileName, setFileName] = useState<{
  //   type: string;
  //   fileName: string;
  // }>();
  // const handleResume = (e: ChangeEvent<HTMLInputElement>) => {
  //   const selectedFiles = e.target.files as FileList;
  //   if (!selectedFiles || selectedFiles.length === 0) {
  //     console.error("No files selected");
  //     return;
  //   }
  //   const { name, type } = selectedFiles[0];
  //   setCurrentFile(selectedFiles[0]);
  //   const validTypes = [
  //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //     "application/pdf",
  //   ];

  //   validTypes.forEach((validType) => {
  //     if (validType === type) {
  //       setFileName({ type, fileName: name });
  //     }
  //   });
  // };
  useEffect(() => {

  }, [applicant,paragraphRef,phoneNumber]);
  return (
    <section className="w-full flex flex-col items-center h-full">
      <ApplyForm label={`${JobTitle}`} onSubmit={handleSubmit}>
        <GroupField label="Personal Information">
          <Field
            required={true}
            label="First Name"
            type="text"
            value={applicant.firstname}
            onChange={(event) => handleChange(event, "firstname")}
          />
          <Field
            required={true}
            label="Last Name"
            type="text"
            value={applicant.lastname}
            onChange={(event) => handleChange(event, "lastname")}
          />
          <Field
            required={true}
            label="Date of Birth"
            type="date"
            value={applicant.birthdate}
            onChange={(event) => handleChange(event, "birthdate")}
          />
          <Options
            variant="outlined"
            label={"Gender (optional)"}
            value={applicant.gendercode}
            property="genderVal"
            text="genderType"
            access={"opt-gender"}
            bind={GenderData}
            onChange={(event) => handleChange(event, "gendercode")}
          />
          {/* <Field
            required={false}
            label="Phone Number"
            type="number"
            value={applicant.mobilephone}
            onChange={(event) => handleChange(event, "mobilephone")}
          /> */}
          <Countries
            paragraphRef={paragraphRef}
            value={phoneNumber.tel}
             onChange={(event) => handleTelNumber(event)}
          />
          <Field
            required={false}
            label="Email"
            type="email"
            value={applicant.emailaddress1}
            onChange={(event) => handleChange(event, "emailaddress1")}
          />
        </GroupField>
        <GroupField label="Address Information">
          <Field
            required={false}
            label="Street"
            type="text"
            value={applicant.address1_line1}
            onChange={(event) => handleChange(event, "address1_line1")}
          />
          <Field
            required={false}
            label="ZIP"
            type="number"
            value={applicant.address1_postalcode}
            onChange={(event) => handleChange(event, "address1_postalcode")}
          />
          <Field
            required={false}
            label="City"
            type="text"
            value={applicant.address1_city}
            onChange={(event) => handleChange(event, "address1_city")}
          />
          <Field
            required={false}
            label="Country"
            type="text"
            value={applicant.address1_country}
            onChange={(event) => handleChange(event, "address1_country")}
          />
        </GroupField>
        <GroupField label="Educational Background">
          <Options
            label={"Education level"}
            value={applicant.pr_edu}
            access={"Education-Level"}
            property={"value"}
            text={"level"}
            variant={undefined}
            bind={eduData}
            onChange={(event) => handleChange(event, "pr_edu")}
          />
          <Field
            required={false}
            label="graduation year"
            type="number"
            value={applicant.pr_graduationyear}
            onChange={(event) => handleChange(event, "pr_graduationyear")}
          />
        </GroupField>
        <GroupField label="Availability">
          <Options
            label={"Notice Period"}
            value={applicant.pr_noticeperiod}
            access={"Notice-Period"}
            property={"Value"}
            text={"Period"}
            variant={undefined}
            bind={noticePeriodData}
            onChange={(event) => handleChange(event, "pr_noticeperiod")}
          />
          <Field
            required={false}
            label="Salary Expection"
            type="number"
            value={applicant.pr_salary}
            onChange={(event) => handleChange(event, "pr_salary")}
          />
        </GroupField>

        {/* <GroupField label=" Additional Information">
          <div className="flex items-center gap-2 w-full">
            <div className="shadow-gray-400 shadow-sm w-full bg-sky-100 h-20 flex flex-col justify-center items-center rounded-md">
              <label
                htmlFor="uploadOtherFiles"
                className="flex flex-col items-center justify-center font-semibold text-slate-700 text-sm"
              >
                <svg
                  className="border-dashed border-white border-2 rounded-lg hover:scale-125"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  height={30}
                  width={35}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  />
                </svg>
                Other Files
              </label>
              <input
                type="file"
                name="Upload-Other-Files"
                id="uploadOtherFiles"
              />
            </div>
            <div className="shadow-gray-400 shadow-sm w-full bg-sky-100 h-20 flex flex-col justify-center items-center rounded-md">
              <label
                htmlFor="uploadResume"
                className="flex flex-col items-center justify-center font-semibold text-slate-700 text-sm"
              >
                <svg
                  className="border-dashed border-white border-2 rounded-lg hover:scale-125"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  height={30}
                  width={35}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  />
                </svg>
                Resume *
              </label>
              <input
                onChange={handleResume}
                required
                type="file"
                name="upload_Resume"
                id="uploadResume"
              />
            </div>
          </div>
        </GroupField>
        <GroupField label={undefined}>
          <div className="w-100 _fr _g7 mt-3 flex items-center gap-2">
            {fileName?.type === "application/pdf" ? (
              <Box
                component="img"
                alt="office-word-icon"
                src={Icons.PDF}
                height={30}
                width={30}
                loading="lazy"
              />
            ) : !fileName?.type ? (
              ""
            ) : (
              <Box
                component="img"
                alt="office-word-icon"
                src={Icons.word}
                height={25}
                width={25}
                loading="lazy"
              />
            )}
            {fileName?.fileName}
          </div>
        </GroupField> */}
        <GroupField label="Declarations and Agreement">
          <div className="flex items-center gap-2">
            <Checkbox required />
            <p className="text-slate-800 text-base">
              I agree to the terms and conditions
            </p>
          </div>
        </GroupField>
        <GroupField label={undefined}>
          <div className="flex justify-center items-center  min-w-full text-base">
            <Button
              color="success"
              className="w-2/4 h-14 text-base"
              variant="contained"
              type="button"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </GroupField>
      </ApplyForm>
    </section>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Checkbox, CircularProgress, SelectChangeEvent } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { eduData, GenderData, Icons, noticePeriodData } from "./_static";
import ApplyForm, { IApplicant } from "../components/Parts/ApplyForm";
import Options from "../components/Parts/Options";
import Countries from "../components/Parts/Countries";
import restService from "../services/rest.service";
import Upload from "../components/Parts/Upload";

const { GroupField } = ApplyForm;
const { Field } = GroupField;


export default function Application() {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const [loader, setloader] = useState<boolean>(false);
  const navigate = useNavigate();
  const JobId: string | undefined = useParams().id;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const JobTitle = urlParams.get("titl");
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<{countryCode: string | undefined | null;tel: string;}>({
    countryCode: "",
    tel: "",
  });
  const handleTelNumber = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setPhoneNumber({
        countryCode: paragraphRef.current?.textContent,
        tel: value,
      });
    },
    [paragraphRef]
  );

  const [applicant, setApplicant] = useState<IApplicant>({
    firstname: "",
    lastname: "",
    emailaddress1: "",
    address1_line1: "",
    address1_country: "",
    address1_city: "",
    address1_postalcode: "",
    familystatuscode: "",
    gendercode: "" ,
    birthdate:"",
    pr_edu: "" ,
    pr_graduationyear_txt: "",
    pr_noticeperiod: "" ,
    pr_salary: "",
    pr_potentialjob: JobId,
   
  });

  async function handleSubmit() {
    setloader(true)
    const formData = new FormData();
    formData.append('file', currentFile as File || '');
    formData.append('firstname', applicant.firstname as string);
    formData.append('lastname', applicant.lastname as string);
    formData.append('emailaddress1', applicant.emailaddress1 as string);
    formData.append('mobilephone', phoneNumber.countryCode + phoneNumber.tel as string);
    formData.append('address1_city', applicant.address1_city as string);
    formData.append('address1_country', applicant.address1_country as string);
    formData.append('address1_line1', applicant.address1_line1 as string);
    formData.append('address1_postalcode', applicant.address1_postalcode as string);
    formData.append('gendercode', applicant.gendercode as any);
    formData.append('birthdate', applicant.birthdate as string);
    formData.append('pr_edu', applicant.pr_edu as any);
    formData.append('pr_graduationyear_txt', applicant.pr_graduationyear_txt as string);
    formData.append('pr_noticeperiod', applicant.pr_noticeperiod as any);
    formData.append('pr_salary', applicant.pr_salary as any);
    formData.append('pr_potentialjob@odata.bind', `/entities(${JobId})` as string);
   
    try {
     return await restService.createCandidte(formData).then(() =>  {
       return  navigate("/Submission")
        
      });
    } catch (error) {
      console.log(error);
    }
  }

  const handleChange = useCallback(
    (
      event:
        | ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
          >
        | SelectChangeEvent,
      field: keyof IApplicant
    ) => {
      const value: string | Date | undefined | number = event.target.value;
      setApplicant({ ...applicant, [field]: value });
    },
    [applicant]
  );
  
  const [fileName, setFileName] = useState<{
    type: string;
    fileName: string;
  }>();

  const handleResume = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files as FileList;
    if (!selectedFiles || selectedFiles.length === 0) {
      console.error("No files selected");
      return;
    }
    const { name, type } = selectedFiles[0];
    setCurrentFile(selectedFiles[0]);
    const validTypes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
    ];

    validTypes.forEach((validType) => {
      if (validType === type) {
        setFileName({ type, fileName: name });
      }
    });
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  useEffect(() => {}, [applicant, paragraphRef, phoneNumber,currentFile]);
  return (
    <section className="w-full flex flex-col items-center h-full">
      <ApplyForm label={`${JobTitle}`} onSubmit={handleSubmit}>
        <GroupField label="Personal Information">
          <Field
            required={true}
            label="First Name"
            type="text"
            value={applicant.firstname || ""}
            onChange={(event) => handleChange(event, "firstname")}
            error={applicant.firstname === "" ? true : false}
          />
          <Field
            required={true}
            label="Last Name"
            type="text"
            value={applicant.lastname || ""}
            onChange={(event) => handleChange(event, "lastname")}
            error={applicant.lastname === "" ? true : false}
          />
          <Field
            required={true}
            label="Date of Birth"
            type="date"
            value={applicant.birthdate || ""}
            onChange={(event) => handleChange(event, "birthdate")}
            error={applicant.birthdate === "" ? true : false}
          />
          <Options
            variant="outlined"
            label={"Gender (optional)"}
            value={applicant.gendercode || ""}
            property="genderVal"
            text="genderType"
            access={"opt-gender"}
            bind={GenderData}
            onChange={(event) => handleChange(event, "gendercode")}
          />
          <Countries
            paragraphRef={paragraphRef}
            value={phoneNumber.tel}
            onChange={(event) => handleTelNumber(event)}
          />
          <Field
            label="Email"
            type="email"
            value={applicant.emailaddress1 || ""}
            onChange={(event) => handleChange(event, "emailaddress1")}
          />
        </GroupField>
        <GroupField label="Address Information">
          <Field

            label="Street"
            type="text"
            value={applicant.address1_line1 || ""}
            onChange={(event) => handleChange(event, "address1_line1")}
          />
          <Field

            label="ZIP"
            type="number"
            value={applicant.address1_postalcode || ""}
            onChange={(event) => handleChange(event, "address1_postalcode")}
          />
          <Field

            label="City"
            type="text"
            value={applicant.address1_city || ""}
            onChange={(event) => handleChange(event, "address1_city")}
          />
          <Field

            label="Country"
            type="text"
            value={applicant.address1_country || ""}
            onChange={(event) => handleChange(event, "address1_country")}
          />
        </GroupField>
        <GroupField label="Educational Background">
          <Options
            label={"Education level"}
            value={applicant.pr_edu || ""} 
            access={"Education-Level"}
            property={"value"}
            text={"level"}
            variant={undefined}
            bind={eduData}
            onChange={(event) => handleChange(event, "pr_edu")}
          />
          <Field

            label="graduation year"
            type="number"
            value={applicant.pr_graduationyear_txt || ""}
            onChange={(event) => handleChange(event, "pr_graduationyear_txt")}
          />
        </GroupField>
        <GroupField label="Availability">
          <Options
            label={"Notice Period"}
            value={applicant.pr_noticeperiod || ""}
            access={"Notice-Period"}
            property={"Value"}
            text={"Period"}
            variant={undefined}
            bind={noticePeriodData}
            onChange={(event) => handleChange(event, "pr_noticeperiod")}
          />
          <Field

            label="Salary Expection"
            type="number"
            value={applicant.pr_salary || ""}
            onChange={(event) => handleChange(event, "pr_salary")}
          />
        </GroupField>
        <GroupField label=" Additional Information">
          <Upload
            label={"Other Files"}
            htmlFor={"uploadOtherFiles"}
            name={"Upload-Other-Files"}
            onChange={(event) => console.log(event.target.files)}
          />
          <Upload
            label={"Resume *"}
            htmlFor={"uploadResume"}
            name={"upload_Resume"}
            onChange={(event) => handleResume(event)}
          />
        </GroupField>
        <GroupField label={""}>
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
        </GroupField>
        <GroupField label="Declarations and Agreement">
          <div className="flex items-center gap-2">
            <Checkbox required />
            <p className="text-slate-800 text-base">
              I agree to the terms and conditions
            </p>
          </div>
        </GroupField>
        <GroupField label={""}>
          <div className="flex justify-center items-center  min-w-full text-base">
            <Button
              disabled={currentFile === null ? true :false}
              color="success"
              className="w-2/4 h-14 text-base text-center flex items-center justify-center"
              variant="contained"
              type="button"
              onClick={handleSubmit}
            >
             <h6 className="text-base min-w-[93%] translate-x-[7%]">Submit</h6> 
             <div className="min-w-[7%] flex items-center justify-center h-[18px] pt-[2px]">
              {loader && <CircularProgress thickness={6} color="inherit" size={18} disableShrink={true}/>}
              </div>
            </Button>
          </div>
        </GroupField>
      </ApplyForm>
    </section>
  );
}

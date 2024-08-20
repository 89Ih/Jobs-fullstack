import { useEffect, useState } from "react";
import { JobDetails } from "../components/Parts/JobDetails";
import restService from "../services/rest.service";
import { useParams } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";

interface Job {
  pr_jobid: string;
  pr_title: string;
  pr_cities: string;
  pr_tasks_txt: string;
  pr_qualifications_txt: string;
  pr_jobtitle: string;
}
const local: Window = window;
export const Jobform = () => {
  const { id } = useParams<{ id: string }>();
  const [filtered, setFiltered] = useState<Job | null>(null);
  const matches = useMediaQuery("(max-width:700px)");
  useEffect(() => {

    const fetchJob = async () => {
      try {
        const res = await restService.fetchJobs();
        const findOne = res.find((v: Job) => v.pr_jobid === id) || null;
        setFiltered(findOne);
      } catch (error) {
        console.error("Failed to fetch job details:", error);
      }
    };

    fetchJob();
    local.scroll(0,0)
  }, [id]);

  return (
    <div className={`flex flex-col items-center ${matches ? "mt-0 w-full p-1" : "mt-10 w-3/4"}`}>
    <JobDetails
      Title={filtered?.pr_title || ""}
      Cities={filtered?.pr_cities || ""}
      Tasks={filtered?.pr_tasks_txt || ""}
      Qualifications={filtered?.pr_qualifications_txt || ""}
      JobId={filtered?.pr_jobid || ""}
      JobTitle={filtered?.pr_jobtitle || ""}
    />
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import OptGruop from "../components/Parts/OptGroup";
import restService from "../services/rest.service";
import useMediaQuery from "@mui/material/useMediaQuery";
import { JobDetails } from "../components/Parts/JobDetails";
import CardSkeleton from "../components/Parts/CardSkeleton";
import Pagination from "@mui/material/Pagination";

type Job = {
  pr_jobid: string;
  pr_jobtitle: string;
  pr_title?: string;
  pr_cities?: string;
  pr_tasks_txt?: string;
  pr_qualifications_txt?: string;
};

const Jobs = () => {
  const matches = useMediaQuery("(max-width:700px)");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [openUp, setOpenUp] = useState(false);
  const [filtered, setFiltered] = useState<Job | null>(null);
  const [queries, setQueries] = useState<Job[]>([]);
  const [items, setItems] = useState<Job[]>([]);
  const [targetCity, setTargetCity] = useState("");
  const [workModel, setWorkModel] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 8;

  /* ---------------- pagination ---------------- */

  const lastPageIndex = currentPage * jobsPerPage;
  const firstPageIndex = lastPageIndex - jobsPerPage;

  const currentJobs = queries.slice(firstPageIndex, lastPageIndex);

  /* ---------------- fetch jobs ---------------- */

  useEffect(() => {
    if (matches) setOpenUp(false);

    restService
      .fetchJobs()
      .then((res: any) => {
        const safe: Job[] = Array.isArray(res) ? res : [];
        setItems(safe);
        setQueries(safe);
      })
      .catch(() => {
        setItems([]);
        setQueries([]);
      });
  }, [matches]);

  /* ---------------- job details ---------------- */

  const fetchJobDetails = (id: string) => {
    const job = queries.find((j) => j.pr_jobid === id) || null;
    setFiltered(job);
    setOpenUp(true);
  };

  /* ---------------- search ---------------- */

  const removeFilter = () => {
    setOpenUp(false);
    const value = inputRef.current?.value?.trim();

    if (!value) {
      setQueries(items);
      return;
    }
  };

  const multiQuery = useCallback(() => {
    setOpenUp(false);

    const text = inputRef.current?.value?.trim().toLowerCase();

    let result = [...items];

    if (text) {
      result = result.filter((j) =>
        j.pr_jobtitle?.toLowerCase().includes(text)
      );
    }

    if (workModel !== "") {
      result = result.filter((j: any) => j.workModel === workModel);
    }

    if (targetCity) {
      result = result.filter((j) =>
        j.pr_cities?.toLowerCase().includes(targetCity.toLowerCase())
      );
    }

    setCurrentPage(1);
    setQueries(result);
  }, [items, workModel, targetCity]);

  /* ---------------- navigation ---------------- */

  function navToJobDetails(ID: string) {
    if (matches) navigate(`/Job-details/${ID}`);
    else fetchJobDetails(ID);
  }

  /* ---------------- pagination change ---------------- */

  const handleChange = (_: any, value: number) => {
    setCurrentPage(value);
  };

  /* ---------------- render ---------------- */

  return (
    <>
      <section className="_sub-header" />

      <section className={matches ? "mt-4" : "mt-10"}>
        {/* ---------------- filters ---------------- */}

        <form
          className={`flex items-center ${
            matches && "flex-wrap justify-between"
          } gap-3 w-full`}
        >
          {/* title */}
          <div className={!matches ? "w-2/4 h-[50px]" : "w-full h-[40px] mx-[3px]"}>
            <div className="flex flex-col border-b border-gray-400 hover:border-transparent">
              <label htmlFor="ipt" className="text-[13px] text-gray-500">
                Job-Title
              </label>

              <input
                id="ipt"
                type="text"
                ref={inputRef}
                onChange={removeFilter}
                className="text-base pl-2 pt-2 outline-none border-b-2 focus:border-blue-500 border-transparent hover:border-black"
              />
            </div>
          </div>

          {/* work model */}
          <div className={!matches ? "w-2/4 h-[50px]" : "w-full h-[40px] mx-[3px]"}>
            <div className="flex flex-col border-b border-gray-400 hover:border-transparent">
              <label className="text-[13px] text-gray-500">Work model</label>

              <select
                value={workModel}
                onChange={(e) =>
                  setWorkModel(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="outline-none border-b-2 focus:border-blue-500 border-transparent hover:border-black pt-2 text-base"
              >
                <option value=""></option>
                <option value={10}>Fulltime</option>
                <option value={20}>Parttime</option>
              </select>
            </div>
          </div>

          {/* city */}
          <div className={!matches ? "w-2/4 h-[50px]" : "w-full h-[40px] mx-[3px]"}>
            <OptGruop
              value={targetCity}
              onChange={(e: any) => setTargetCity(e.target.value)}
            />
          </div>

          {/* search */}
          <button
            type="button"
            onClick={multiQuery}
            className={`border-none rounded-md bg-sky-500 text-white font-semibold hover:bg-sky-400 text-base ${
              !matches ? "w-2/4 h-[50px]" : "w-full h-[40px] mx-[3px] mt-2"
            }`}
          >
            Search
          </button>
        </form>

        {/* ---------------- results ---------------- */}

        <div className={`w-full flex gap-2 ${matches ? "mt-3" : " mt-10"}`}>
          {queries.length === 0 ? (
            <div className="flex flex-col gap-1 min-w-full">
              <CardSkeleton cards={10} />
            </div>
          ) : (
            <ul className={`flex flex-col gap-1 ${!openUp ? "min-w-full" : "w-1/4"}`}>
              {currentJobs.map((v) => (
                <li
                  key={v.pr_jobid}
                  onClick={() => navToJobDetails(v.pr_jobid)}
                  className="px-3 w-full h-16 bg-slate-100 flex items-center justify-between text-slate-700 border-2 border-slate-100 hover:border-slate-400"
                >
                  <p className="text-base font-semibold">{v.pr_jobtitle}</p>
                </li>
              ))}
            </ul>
          )}

          {/* details panel */}
          {openUp && filtered && (
            <JobDetails
              Title={filtered.pr_title || ""}
              Cities={filtered.pr_cities || ""}
              Tasks={filtered.pr_tasks_txt || ""}
              Qualifications={filtered.pr_qualifications_txt || ""}
              JobId={filtered.pr_jobid}
              JobTitle={filtered.pr_jobtitle}
            />
          )}
        </div>

        {/* ---------------- pagination ---------------- */}

        <div className="mt-10 flex justify-center">
          <Pagination
            count={Math.ceil(queries.length / jobsPerPage)}
            page={currentPage}
            onChange={handleChange}
            variant="outlined"
            color="primary"
          />
        </div>
      </section>
    </>
  );
};

export default Jobs;
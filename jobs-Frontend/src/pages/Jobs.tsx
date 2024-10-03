/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import OptGruop from "../components/Parts/OptGroup";
import restService from "../services/rest.service";
import useMediaQuery from "@mui/material/useMediaQuery";
import { JobDetails } from "../components/Parts/JobDetails";
import CardSkeleton from "../components/Parts/CardSkeleton";
import Pagination from '@mui/material/Pagination';

const Jobs = () => {
  const matches = useMediaQuery("(max-width:700px)");
  const inputRef = useRef<HTMLInputElement>(null);
  const [openUp, setOpenUp] = useState<boolean>(false);
  const [filtered, setFiltered] = useState<any>({});
  const [queries, setQueries] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [targetCity, setTargetCity] = useState<string>("");
  const [workModel, setWorkModel] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [jobsPerPage, setJobsPerPage] = useState<number>(8);
  const lastPageIndex = currentPage * jobsPerPage;
  const firstPageIndex = lastPageIndex - jobsPerPage;
  const currentJobs = queries.slice(firstPageIndex,lastPageIndex);
  const navigate = useNavigate();

  const fetchJobDetails = (id: string) => {
    setOpenUp(true);
    const filterById = queries.filter(({ pr_jobid }) => pr_jobid === id);
    setFiltered(filterById[0]);
    return filtered;
  };
  function removeFilter() {
    setOpenUp(false);
    const tJob = inputRef.current?.value;
    if (tJob === "" || undefined) {
      return setQueries(items);
    }
    return setQueries(queries);
  }
  const multiQuery = useCallback(() => {
    setOpenUp(false);
    const tJob = inputRef.current?.value;
    if (tJob === "" || undefined) {
      return setQueries(items);
    }
    if (tJob !== null || "") {
      return setQueries(
        queries.filter(({ pr_jobtitle }) =>
          pr_jobtitle.toLowerCase().includes(tJob?.toLowerCase())
        )
      );
    }
    return setQueries(queries);
  }, [inputRef, queries, items]);
  function navToJobDeatils(ID: string) {
    if (matches) {
      return navigate(`/Job-details/${ID}`);
    }
    return fetchJobDetails(ID);
  }
  const handleChange = (e:any)=> {setCurrentPage(e.target.textContent)
    console.log(currentPage);
    
  }
 
  useEffect(() => {
    if (matches) {
      setOpenUp(false);
    }
    restService.fetchJobs().then((res) => {
      setItems(res);
      setQueries(res);
    });
  }, [filtered, matches]);
  return (
    <>
      <section className="_sub-header" />
      <section className={matches ? "mt-4" : "mt-10"}>
        <form className={`flex items-center ${matches && "flex-wrap justify-between"} gap-3 w-full`}
        >
          <div className={!matches ? "w-2/4 h-[50px]" : "w-full h-[40px] mx-[3px]"}>
            <div className=" flex flex-col border-b border-gray-400 hover:border-transparent">
              <label htmlFor="ipt" className="text-[13px] text-gray-500 ">
                Job-Title
              </label>
              <input
                id="ipt"
                type="text"
                className="text-base pl-2 pt-2 outline-none bg-none rounded-none border-b-2 focus:border-blue-500 border-transparent hover:border-black"
                ref={inputRef}
                onChange={removeFilter}
                // onKeyDown={({ key }) => key === 'Enter' && multiQuery()}
              />
            </div>
          </div>
          <div className={!matches ? "w-2/4 h-[50px]" : "w-full h-[40px] mx-[3px]"}>
            <div className="flex flex-col border-b border-gray-400 hover:border-transparent">
              <label
                htmlFor="workModelHous"
                className="text-[13px] text-gray-500"
              >
                Work model
              </label>
              <select
                id="workModelHous"
                value={workModel}
                onChange={(event: any) => setWorkModel(event.target.value)}
                className="outline-none bg-none rounded-none border-b-2  focus:border-blue-500 border-transparent hover:border-black pt-2 text-base"
              >
                <option className="text-base" value={""}></option>
                <option className="text-base" value={10}>
                  Fulltime
                </option>
                <option className="text-base" value={20}>
                  Parttime
                </option>
              </select>
            </div>
          </div>
          <div className={!matches ? "w-2/4 h-[50px] " : "w-full h-[40px] mx-[3px] "}>
            <OptGruop
              value={targetCity}
              onChange={(event) => setTargetCity(event.target.value)}
            />
          </div>
          <button
            className={`border-none rounded-md bg-sky-500 text-white font-semibold hover:bg-sky-400 text-base 
              ${!matches ? "w-2/4 h-[50px]" : "w-full h-[40px] mx-[3px] mt-2"}`}
            onClick={multiQuery}
            type="button"
          >
            Search
          </button>
        </form>
        <div className={`w-full flex gap-2 ${matches ? "mt-3" : " mt-10"}`}>
          {queries.length === 0 ? (
            <div className="flex flex-col gap-1 min-w-full">
              {" "}
              <CardSkeleton cards={10} />
            </div>
          ) : (
            <ul className={`flex flex-col gap-1 ${!openUp ? "min-w-full" : "w-1/4"}`}>
              {currentJobs?.map((v) => {
                return (
                  <li
                    key={v.pr_jobid}
                    onClick={() => navToJobDeatils(v.pr_jobid)}
                    className="px-3 w-full h-16 bg-slate-100 flex items-center justify-between text-slate-700 border-2 border-solid border-slate-100 hover:border-slate-400"
                  >
                    <div>
                      {
                        <p className="text-base font-semibold">
                          {v.pr_jobtitle}
                        </p>
                      }
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {openUp && (
            <JobDetails
              Title={filtered.pr_title}
              Cities={filtered.pr_cities}
              Tasks={filtered.pr_tasks_txt}
              Qualifications={filtered.pr_qualifications_txt}
              JobId={filtered.pr_jobid}
              JobTitle={filtered.pr_jobtitle}
            />
          )}
        </div>
       <div className=" mt-10 flex items-end justify-center">
        <Pagination 
          count={Math.ceil(queries.length/jobsPerPage) } 
          variant="outlined" 
          color="primary"  
          onClick={handleChange}
          
          />
       </div>
      </section>
    </>
  );
};

export default Jobs;

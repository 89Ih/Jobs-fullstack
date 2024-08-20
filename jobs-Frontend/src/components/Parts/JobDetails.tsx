import { Link } from "react-router-dom";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import useMediaQuery from "@mui/material/useMediaQuery";
import Loading from "../Loading/Loading";

interface IProps {
  Title: string;
  Cities: string;
  Tasks: string;
  Qualifications: string;
  JobId: string;
  JobTitle: string;
}
export const JobDetails = (props: IProps) => {
  const matches = useMediaQuery("(max-width:700px)");
  const matches900 = useMediaQuery("(max-width:900px)");

  return (
    <>
      {!props.Title ? (
        <Loading />
      ) : (
        <div className={`${matches? "w-full":"w-3/4"} border border-solid border-slate-100 _shadow min-h-[800px]`}>
          <article className={`p-16 min-h-full flex flex-col justify-between gap-10`}>
            <div>
              <h2 className="text-2xl font-semibold text-slate-700">
                {props.Title}
              </h2>

              <div className="flex gap-1 justify-end mt-10">
                {props.Cities && <LocationCityIcon style={{ color: "#374558" }} />}
                <p className="text-base">{props.Cities}</p>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-slate-700">
                  Job-Description
                </h2>
                <p className="text-slate-700 text-base">{props.Tasks}</p>
              </div>
              <div className="mt-5 flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-slate-700">
                  Qualifications
                </h2>
                <p className="text-slate-700 text-base">
                  {props.Qualifications}
                </p>
              </div>
            </div>
            <div className="flex justify-end w-full items-end">
              <Link
                to={`/Jobs/${props.JobId}?titl=${props.JobTitle}`}
                className={matches ? "w-full" : matches900 ? "w-2/4" : "w-1/4"}
              >
                <button
                  onClick={() => window.scroll(0, 0)}
                  type="button"
                  className="bg-green-600 text-slate-50 h-9 w-full rounded-lg font-semibold hover:bg-green-500 text-base"
                >
                  Apply
                </button>
              </Link>
            </div>
          </article>
        </div>
      )}
    </>
  );
};

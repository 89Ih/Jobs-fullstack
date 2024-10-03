/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, ChangeEvent,FC, RefObject } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';

interface ICountries {
  paragraphRef :RefObject<HTMLParagraphElement>;
  value:string | undefined
  onChange:(event: any)=> void 
}

const Countries: FC<ICountries> = ({paragraphRef,value,onChange}) => {
  const url = "https://ih-countries-api.herokuapp.com/countries/";


  const [show, setShow] = useState<boolean>(false);
  const [counties, setCountries] = useState<any[]>([]);
  const [selectCountry, setSelectCountry] = useState<any>({
    index: 179,
    name: "Germany",
    countryCode: "+49",
  });

  const handleSelectedCountry = (
    event: ChangeEvent<HTMLSelectElement>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    index: number
  ) => {
    setSelectCountry({
      name: event.target.value,
      index: event.target.selectedIndex,
    });
    setShow(false);
  };

  useEffect(() => {
    async function fetchCountry() {
      const response = await fetch(url);
      const data = await response.json();
      setCountries(data);
    }
    fetchCountry();
  }, [selectCountry, show]);
  return (
    <div className="flex flex-col w-full ">
      {!show ? (
        <div className="flex items-center gap-1 w-full border-gray-300 rounded-md px-3 border border-solid hover:border-black ">
          { counties.length === 0 ?  (
            <CircularProgress  value={75} />
          ) : (
            <div className="inline-flex items-center justify-center gap-1 ">
              <Tooltip title="Change country code" className="inline-flex items-center justify-center ">
                <img
                  
                  width={22}
                  height={20}
                  alt="counties"
                  onClick={()=>setShow(!show)}
                  className="object-contain "
                  loading="lazy"
                  src={`https://flagpedia.net/data/flags/icon/72x54/${counties[selectCountry.index]?.alpha2Code.toLowerCase()}.png`}
                />
                </Tooltip>
                <p className="text-base" ref={paragraphRef}>
                  {counties[selectCountry.index]?.idd.root}
                  {counties[selectCountry.index]?.idd.suffixes[0]}
                </p>
            </div>
          )}
          <div className="w-11/12 flex items-center h-14">
        
            <input
              type="number"
              className="w-full border-none outline-none"
              value={value}
              onChange={onChange}
            />
          </div>
        </div>
      ) : (
        <select
          className="appearance-none h-14 border-gray-300 border rounded-md px-3 "
          value={selectCountry.name}
          onChange={(event) =>handleSelectedCountry(event, selectCountry.index)}
          onKeyPress={(event:any)=> event.key === 'enter' && handleSelectedCountry(event, selectCountry.index)}
        >{ counties.map((v, i) => {
            return (
              <option key={i} value={v.name.common}>
                {v.name.common}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
};

export default Countries;

import { LocationData } from "../../pages/_static";
interface IOptGroup {
  value: string;
  onChange: (event: any) => void;
}
const OptGroup = ({ value, onChange }: IOptGroup) => {
  return (
    <div className=" flex flex-col border-b border-gray-400 hover:border-transparent">
      <label htmlFor="LocationId" className="text-[13px] text-gray-500">
        Location
      </label>
      <select
        id="LocationId"
        value={value}
        onChange={onChange}
        className="outline-none pt-2 border-b-2  focus:border-blue-500 border-transparent hover:border-black text-base"
      >
        <optgroup label=""><option value=""></option></optgroup>
        {LocationData.map(({ country, cities, id }: any) => (
          <optgroup
            className="font-semibold px-1 text-base"
            label={country}
            key={id}
          >
            {cities.map((city: any) => (
              <option
                className="border-b solid border-gray-300 my-3 focus:bg-sky-100 text-base" 
                key={city}
                value={city}
              >
                {city}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};

export default OptGroup;

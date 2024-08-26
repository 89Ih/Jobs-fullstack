import { ChangeEvent, FC } from "react";
import { Icons } from "../../pages/_static";
interface IUpload {
    label : string
    htmlFor:string
    name: string;
    onChange: (event: ChangeEvent<HTMLInputElement>)=> void
}

const Upload: FC<IUpload> = ({label,htmlFor,name,onChange}) => {
    return (
      <div className="flex flex-col w-full">
      <div className="flex items-center gap-2 w-full">
        <div className="shadow-gray-400 shadow-sm w-full bg-sky-100 h-20 flex flex-col justify-center items-center rounded-md">
          <label
            htmlFor={htmlFor}
            className="flex flex-col items-center justify-center font-semibold text-slate-700 text-sm"
          >
            <div
              contentEditable="true"
              dangerouslySetInnerHTML={{ __html: Icons.UPLOAD_SVG }}
              className="border-dashed border-white border-2 rounded-lg hover:scale-125"
            />
            {label}
          </label>
          <input className="border-none focus:border-none" type="file" name={name} id={htmlFor} onChange={onChange}  accept=".pdf, .doc, .docx"/>
        </div>
      </div>
      </div>
    );
}
 
export default Upload;
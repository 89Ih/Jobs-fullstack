import { FC } from "react";
import { Icons } from "../../pages/_static";
interface IUpload {
    label : string
    htmlFor:string
    name: string;
    onChange: (event: any)=> void
}

const Upload: FC<IUpload> = ({label,htmlFor,name,onChange}) => {
    return (
      <div className="flex items-center gap-2 w-full">
        <div className="shadow-gray-400 shadow-sm w-full bg-sky-100 h-20 flex flex-col justify-center items-center rounded-md focus:outline-none">
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
          <input type="file" name={name} id={htmlFor} onChange={onChange}  accept=".pdf, .doc, .docx"/>
        </div>
      </div>
    );
}
 
export default Upload;
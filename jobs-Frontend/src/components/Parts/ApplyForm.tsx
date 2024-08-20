import { TextField } from "@mui/material";
import { FC, ReactNode, useEffect,Children } from "react";

interface IForm {
  label: any;
  children: ReactNode;
  onSubmit:()=> void
}
interface IGroupField {
  label: any;
  children: ReactNode;
}
interface IField {
  label: string;
  type: string;
  value:any;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  required:boolean
  
}
const ApplyForm: FC<IForm> & { GroupField: FC<IGroupField> & { Field: FC<IField> } } = ({ children,label,onSubmit }) => {


  return (
    <form onSubmit={onSubmit} className="mt-10 _formWidth flex flex-col items-center gap-5">
        <fieldset className="w-full flex flex-col gap-3 mb-3">
          <legend className="mb-2 text-3xl  text-slate-800">
            {label}
          </legend>
        </fieldset>
      {children}
    </form>
  );
};
const GroupField: FC<IGroupField> = ({ label, children }) => {
  const count = Children.count(children);
  useEffect(()=>{
    
  })
  return (
    <fieldset className="w-full flex flex-col gap-3 mb-3">
      <legend className="mb-4  text-slate-800 font-semibold text-xl">{label}</legend>
      <div className={`flex gap-4 ${ count > 2 && 'flex-wrap'}`}>{children}</div>
    </fieldset>
  );
};
const Field: FC<IField> = ({ label, type,value,onChange, required }) => {
  return (
    <TextField
      label={label}
      type={type}
      value={value}
      onChange={(event)=> onChange(event)}
      variant="outlined"
      fullWidth
      required={required}

    />
  );
};
// Explicitly define nested components
const GroupFieldWithField: FC<IGroupField> & { Field: FC<IField> } = GroupField as FC<IGroupField> & { Field: FC<IField> };
GroupFieldWithField.Field = Field;

ApplyForm.GroupField = GroupFieldWithField;

export default ApplyForm;

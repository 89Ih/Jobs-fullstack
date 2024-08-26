import { TextField } from "@mui/material";
import { FC, ReactNode,Children, ChangeEvent } from "react";


export interface IApplicant {
  firstname?: string;
  lastname?: string;
  emailaddress1?: string;
  address1_country?: string;
  address1_line1?: string;
  address1_city?: string;
  address1_postalcode?: string;
  familystatuscode?: string;
  gendercode?: string ;
  birthdate?: string;
  pr_edu?:string;
  pr_graduationyear_txt?: string;
  pr_noticeperiod?: string;
  pr_salary?: string;
  pr_potentialjob?: string;

}

interface IForm {
  label: string;
  children: ReactNode;
  onSubmit:()=> void
}
interface IGroupField {
  label: string;
  children: ReactNode;
}
interface IField {
  label: string;
  type: string;
  value:string | number;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement >) => void,
  required:boolean
  
}
const ApplyForm: FC<IForm> & { GroupField: FC<IGroupField> & { Field: FC<IField> } } = ({ children,label,onSubmit }:IForm) => {


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

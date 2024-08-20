
import {InputLabel,Select,MenuItem,FormControl} from "@mui/material";
interface IOptions {
  label:string; 
  value: number | undefined;
  access:string;
  property:string;
  text:string;
  variant: "outlined" | "filled" | "standard" | undefined;
  bind:any[];
  onChange:(event:any)=> void  
}
const Options:React.FC<IOptions>  = ({variant,value,label,access,bind,property,text,onChange}) => {
    return ( 
        <FormControl fullWidth>
        <InputLabel id={access}>{label}</InputLabel>
        <Select
          labelId={access}
          value={value}
          onChange={onChange}
          label={label}
          variant={variant}
        >
           {bind.map((v,i)=>{
            return(
                <MenuItem key={i}  value={v[property]}>{v[text]}</MenuItem>
            )
           }) }
        </Select>
      </FormControl>
    );
}



export default Options;
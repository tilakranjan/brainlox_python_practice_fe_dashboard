import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useForm } from "react-hook-form";

function Input({lbl,reg}) {
   return(
   <div className='form-control w-50'>
 <label>
        {lbl}:<br />
        <input
          className="form-group w-100 center"
          name={lbl}
          {...reg(lbl, { required: true })}
        ></input>
      </label>
      </div>
    
  )
}

export default Input
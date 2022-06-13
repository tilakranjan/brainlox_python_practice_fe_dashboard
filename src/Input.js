import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function Input({lbl,reg}) {
  return (
    <div className='inputList'>
      <label className='inputLabel'>
        {lbl}
      </label>
      <textarea
        type="textarea"
        className="inputOption"
        name={lbl}
        {...reg(lbl, { required: true })}
      ></textarea>
    </div>
  );
}

export default Input;
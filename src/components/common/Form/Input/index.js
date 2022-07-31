import React from "react";
import "./style.scss";

const Input = ({ labeltxt, inputfieldcss, labelcss, inputmaincss, placeholder, inputType, errcss, name, inputref }) => {
    return (
        <>
            <div className={`col-md-12 mb-4 inputmain ${inputmaincss}`}>
                <label className={`field-lbl ${labelcss}`}>{labeltxt}</label>
                <input
                    required
                    name={name}
                    placeholder={placeholder}
                    type={inputType}
                    className={`form-control input-field ${inputfieldcss} ${errcss}`}
                    ref={inputref}
                />
            </div>
        </>
    )
}

export default Input;
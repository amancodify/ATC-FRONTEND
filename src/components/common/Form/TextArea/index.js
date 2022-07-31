import React from "react";
import "./style.scss";

const TextArea = ({ labeltxt, inputfieldcss, labelcss, inputmaincss, errcss, name, inputref, TA_as, TA_rows }) => {
    return (
        <>
            <div className={`col-md-12 mb-4 inputmain ${inputmaincss}`}>
                <label className={`field-lbl ${labelcss}`}>{labeltxt}</label>
                <textarea
                    name={name}
                    as={TA_as}
                    rows={TA_rows}
                    className={`form-control input-field ${inputfieldcss} ${errcss}`}
                    ref={inputref}
                />
            </div>
        </>
    )
}

export default TextArea;
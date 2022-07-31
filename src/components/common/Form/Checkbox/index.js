import React from "react";

const CheckBox = ({ name, id, checked, text, onChangeHandler, className, disabled = false, refdata, required }) => {
    return (
        <>
            <label name={name} className={`checkbox-main ${className}`} disabled={disabled}>
                <input required={required} ref={refdata} id={id} name={name} defaultChecked={checked} onChange={onChangeHandler} className="form-checkbox" type="checkbox" disabled={disabled} />
                <span className="checkbox-txt">{text}</span>
            </label>
        </>
    )
}

export default CheckBox;
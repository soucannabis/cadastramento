import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PhoneNumberInput = ({id, value, onChange, onBlur, handleChangeInput}) => {
  const [phone, setPhone] = useState(value || "");

  const handleChange = (value, country) => {
    setPhone(value);
    if (onChange) {
      onChange(value);
    }
    if (handleChangeInput) {
      handleChangeInput(value);
    }
  };

  return (
    <div>
      <PhoneInput
        className="form-control-phone"
        country={"br"}
        value={phone}
        onChange={handleChange}
        onBlur={onBlur}
        inputProps={{
          id: id,
          name: "phone",
          required: true,
        }}
      />
    </div>
  );
};

export default PhoneNumberInput;

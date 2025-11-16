import React from "react";

interface RegistrationTypeSelectorProps {
  onTypeChange: (type: string) => void;
  marginTop?: string;
}

/**
 * Offers three registration types: username, email, and phone
 */
export const RegistrationTypeSelector: React.FC<RegistrationTypeSelectorProps> = ({
  onTypeChange,
  marginTop = "1rem",
}) => {
  return (
    <div style={{ marginTop }}>
      <p>Registration Type</p>
      <select
        style={{
          color: "black",
          backgroundColor: "white",
          height: "2rem",
          width: "12rem",
        }}
        onChange={(e) => onTypeChange(e.target.value)}
      >
        <option value="username">Username</option>
        <option value="email">Email</option>
        <option value="phone">Phone</option>
      </select>
    </div>
  );
};

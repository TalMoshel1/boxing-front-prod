import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { repeatEndDate } from "../functions/repeatEndDate.js"; // Make sure to import your function correctly

const SetGroupLesson = () => {
  const data = useSelector((state) => state.calendar.groupModalData);
  const [boxing, setBoxing] = useState(localStorage.getItem("boxing"));
  const [message, setMessage] = useState("");

  let user = localStorage.getItem("boxing");
  if (user) {
    user = JSON.parse(user);
  }

  const [formData, setFormData] = useState({
    trainer: "דוד",
    name: "",
    description: "",
    day: data.date.date,
    startTime: "",
    endTime: "",
    repeatsWeekly: false,
    repeatMonth: "",
    isApproved: true,
    type: "group",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });

    if (name === "repeatsWeekly" && newValue) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        startTime: "",
        endTime: "",
        repeatMonth: "1",
        isApproved: false,
      }));
    }

    if (name === "repeatMonth" && formData.repeatsWeekly) {
      const endDate = repeatEndDate(formData.day, parseInt(value, 10));
      setFormData((prevFormData) => ({
        ...prevFormData,
        repeatEndDate: endDate,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { repeatMonth, ...formDataToSend } = formData;

    try {
      const token = user.token;
      console.log("token: ", token);
      const response = await fetch(
        "https://boxing-front-prod.onrender.com/api/lessons/group",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `${token}`,
          },
          body: JSON.stringify(formDataToSend),
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setMessage(data);
    } catch (error) {
      console.error("Error creating group lesson:", error);
      setMessage("error");
    }
  };

  useEffect(() => {
    if (data) {
      setFormData({
        ...formData,
        day: data.date.date,
      });
    }
  }, [data]);

  useEffect(() => {
    console.log("formData:", formData);
  }, [formData]);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          שם האימון:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          תיאור האימון:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          שעת התחלה (דוגמא: 08:00):
          <input
            type="text"
            name="startTime"
            pattern="[0-9]{2}:[0-9]{2}"
            placeholder="HH:MM"
            value={formData.startTime}
            onChange={handleChange}
            required={formData.repeatsWeekly}
          />
        </label>
      </div>
      <div>
        <label>
          שעת סיום (דוגמא: 09:00):
          <input
            type="text"
            name="endTime"
            pattern="[0-9]{2}:[0-9]{2}"
            placeholder="HH:MM"
            value={formData.endTime}
            onChange={handleChange}
            required={formData.repeatsWeekly}
          />
        </label>
      </div>
      <div>
        <label>
          אימון חוזר
          <input
            type="checkbox"
            name="repeatsWeekly"
            checked={formData.repeatsWeekly}
            onChange={handleChange}
          />
        </label>
      </div>
      {formData.repeatsWeekly && (
        <div>
          <label>
            לכמה חודשים:
            <select
              name="repeatMonth"
              value={formData.repeatMonth}
              onChange={handleChange}
              required={formData.repeatsWeekly}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      <div></div>
      <button type="submit">צור אימון</button>
    </form>
  );
};

export default SetGroupLesson;

import React, { useEffect, useState } from "react";
import "./CreatedInterview.css";
import Button from "../Button";
import { apiRoutes } from "../../services/apiRoutes";
import { axiosDelete, axiosGet } from "../../services/axios.config";
import convertDate from "../../utils/convertDates";

function CreatedInterview() {
  const [interviews, setInterviews] = useState([]);

  const fetchInterviews = async () => {
    const responseData = await axiosGet(
      `${import.meta.env.VITE_CUVETTE_JOB_POST_API_URL}${
        apiRoutes.FETCH_INTERVIEW
      }`
    );
    setInterviews(responseData.data.interviews);
  };

  const handleDelete = async (interviewId) => {
    const responseData = await axiosDelete(
      `${import.meta.env.VITE_CUVETTE_JOB_POST_API_URL}${
        apiRoutes.DELETE_INTERVIEW
      }`.replace(":interviewId", interviewId)
    );

    if (responseData.success) {
      toast.success(responseData.message);
    } else {
      toast.error(responseData.message);
    }
  };

  useEffect(() => {
    (async () => fetchInterviews())();
  }, [handleDelete]);
  return interviews.length ? (
    <div className="job-cards">
      {interviews.map((interview) => (
        <div className="job-card" key={interview._id}>
          <div className="job-details">
            <b>Job Title :</b> {interview.title}
          </div>
          <div className="job-details">
            <b>Job Desc :</b> {interview.description}
          </div>
          <div className="job-details">
            <b>Exper. Level :</b> {interview.experienceLevel}
          </div>
          <div className="job-details">
            <b>End Date :</b> {convertDate(interview.endDate)}
          </div>
          <div className="job-details">
            <Button
              children="Delete"
              className="job-delete-btn"
              onClick={() => handleDelete(interview._id)}
            />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div></div>
  );
}

export default CreatedInterview;

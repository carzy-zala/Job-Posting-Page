import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faEnvelope,
  faHouse,
  faPhone,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import "./Sidebar.css";
import Navbar from "../navbar/Navbar";
import Button from "../Button";
import Container from "../Container";
import { useForm } from "react-hook-form";
import Input from "../Input";

function Sidebar() {
  const [createInterview, setCreateInterview] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      experienceLevel: "",
      endDate: "",
      invitedCandidates: "",
    },
  });

  return (
    <div>
      <Navbar />
      <div className="sidebar">
        <FontAwesomeIcon icon={faHouse} size="2xl" />
      </div>
      {!createInterview && (
        <div className="add-interviw-btn-div">
          <Button
            children="Create Interview"
            className="add-interviw-btn"
            onClick={() => {
              setCreateInterview(!createInterview);
            }}
          />
        </div>
      )}

      {createInterview && (
        <form onSubmit={handleSubmit()} noValidate>
          <div className="add-auth-main-div">
            <Container classname="add-input-div-container">
              <label className="add-label">Job Title</label>
              <Input
                className="add-input-fields"
                id="name"
                type="text"
                placeholder="Job Title"
              />
            </Container>
            <Container classname="add-input-div-container">
              <label className="add-label" style={{ alignSelf: "start" }}>
                Job Description
              </label>

              <textarea
                name="postContent"
                placeholder="Job Description"
                rows={5}
                className="add-input-fields-desc"
                onClick={() => {}}
              />
            </Container>
            <Container classname="add-input-div-container">
              <label className="add-label">Experience Level</label>

              <select
                {...register("Title", { required: true })}
                className="add-input-fields "
              >
                <option className="options" value="" selected disabled hidden>
                  Experience Level
                </option>
                <option className="options" value="0-2 Years">
                  0-2 Years
                </option>
                <option className="options" value="2-5 Years">
                  2-5 Years
                </option>
                <option className="options" value="5-10 Years">
                  5-10 Years
                </option>
                <option className="options" value="10+ Years">
                  10+ Years
                </option>
              </select>
            </Container>
            <Container classname="add-input-div-container">
              <label className="add-label">Add Candidate</label>

              <Input
                className="add-input-fields"
                id="name"
                type="text"
                placeholder="Add Candidates"
              />
            </Container>
            <Container classname="add-input-div-container">
              <label className="add-label">End Date</label>

              <Input className="add-input-fields" id="name" type="date" />
            </Container>

            <Container classname="btn-container">
              <select className="select-option">
                <option
                  className="template-options"
                  value="Template 1"
                  selected
                >
                  Template 1
                </option>
                <option className="template-options" value="Template 2">
                  Template 2
                </option>
                <option className="template-options" value="Template 3">
                  Template 3
                </option>
                <option className="template-options" value="Template 4">
                  Template 4
                </option>
                <option className="template-options" value="Template 5">
                  Template 5
                </option>
              </select>
              {/*<a href="www.google.com">View Templates</a>*/}
              <Button className="send-btn" children="Send" type="Submit" />
            </Container>
          </div>
        </form>
      )}
    </div>
  );
}

export default Sidebar;

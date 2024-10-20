import React, { useEffect, useState } from "react";
import Loader from "../../Components/Loader/Loader.jsx";
import "./AddInterview.css";
import Navbar from "../../Components/navbar/Navbar.jsx";
import Button from "../../Components/Button.jsx";
import Container from "../../Components/Container.jsx";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import Input from "../../Components/Input.jsx";
import { toast } from "react-toastify";
import { apiRoutes } from "../../services/apiRoutes.js";
import { axiosPost } from "../../services/axios.config.js";
import Sidebar from "../../Components/sidebar/Sidebar.jsx";
import { useDispatch } from "react-redux";
import { initialised } from "../../Feature/adminSlice.js";
import { useNavigate } from "react-router-dom";
import CreatedInterview from "../../Components/CreatedJobs/CreatedInterview.jsx";

function AddInterview() {
  const dispatch = useDispatch();
  const navigator = useNavigate();

  useEffect(() => {
    dispatch(initialised());
  }, []);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigator("/");
    }
  }, []);

  const [createInterview, setCreateInterview] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      experienceLevel: "",
      endDate: "",
      emails: [],
      templateNo: "1",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "invitedCandidates",
  });

  const [isLoading, setIsLoading] = useState(false);

  const createInterviewHandle = async (data) => {
    if (!isLoading) {
      setIsLoading(true);

      const {
        title,
        description,
        experienceLevel,
        endDate,
        emails: invitedCandidates,
        templateNo,
      } = data;

      const responseData = await axiosPost(
        `${import.meta.env.VITE_CUVETTE_JOB_POST_API_URL}${
          apiRoutes.CREATE_INTERVIEW
        }`,
        {
          title,
          description,
          endDate,
          experienceLevel,
          invitedCandidates,
          templateNo,
        }
      );

      if (responseData.success) {
        toast.success(responseData.message);
        setCreateInterview(false);
      } else {
        toast.error(responseData.message);
      }

      setIsLoading(false);
    }
  };

  const createInterviewHandleError = async (error) => {
    const { title, description, experienceLevel, endDate } = error;

    if (title) {
      toast.error(title.message);
    } else {
      if (description) {
        toast.error(description.message);
      } else {
        if (experienceLevel) {
          toast.error(experienceLevel.message);
        } else {
          toast.error(endDate.message);
        }
      }
    }
  };

  const [email, setEmail] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Function to remove email from the list
  const handleRemoveEmail = (index) => {
    const emailList = getValues("emails");
    const updatedEmails = emailList.filter((_, i) => i !== index);
    setValue("emails", updatedEmails);
  };

  const handleAddEmail = () => {
    const emailList = getValues("emails"); // Get the current emails array

    if (email && !validateEmail(email)) {
      toast.error("Please enter valid email !");
    }

    if (email && validateEmail(email) && !emailList.includes(email)) {
      setValue("emails", [...emailList, email]); // Add email to the array
      setEmail(""); // Clear the input field
    }
  };

  return (
    <div>
      <Navbar />
      <Sidebar handleHome={setCreateInterview} />

      {!createInterview && (
        <div className="add-interviw-btn-div">
          <Button
            children="Create Interview"
            className="add-interviw-btn"
            onClick={() => {
              setCreateInterview(!createInterview);
            }}
          />

          <CreatedInterview />
        </div>
      )}

      {createInterview && (
        <form
          style={{ paddingBottom: "3rem" }}
          onSubmit={handleSubmit(
            createInterviewHandle,
            createInterviewHandleError
          )}
          noValidate
        >
          <div className="add-auth-main-div">
            <Container classname="add-input-div-container">
              <label className="add-label">Job Title</label>
              <Input
                className="add-input-fields"
                id="title"
                type="text"
                placeholder="Job Title"
                {...register("title", { required: "Title can't be empty !" })}
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
                {...register("description", {
                  required: "Description can't be empty !",
                })}
              />
            </Container>
            <Container classname="add-input-div-container">
              <label className="add-label">Experience Level</label>

              <select
                className="add-input-fields "
                {...register("experienceLevel", {
                  required: "Please select required Experience Level !",
                })}
              >
                <option className="options" value="" disabled hidden>
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

              <Container classname="add-email-container">
                <div>
                  <Controller
                    control={control}
                    name="emails"
                    render={({ field }) => (
                      <div>
                        {field.value.length > 0 && (
                          <div>
                            {field.value.map((email, index) => (
                              <div
                                key={index}
                                style={{
                                  display: "inline-block",
                                  padding: "5px 10px",
                                  margin: "5px",
                                  backgroundColor: "#e0e0e0",
                                  borderRadius: "20px",
                                }}
                              >
                                {email}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveEmail(index)}
                                  style={{
                                    marginLeft: "8px",
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  />
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Add email and press Enter"
                  className="add-candidate-field"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddEmail();
                    }
                  }}
                />
              </Container>
            </Container>
            <Container classname="add-input-div-container">
              <label className="add-label">End Date</label>

              <Input
                className="add-input-fields"
                id="endDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                {...register("endDate", {
                  required: "Please select End Date !",
                })}
              />
            </Container>

            <Container classname="btn-container">
              <select className="select-option" {...register("templateNo")}>
                <option className="template-options" value={1}>
                  Template 1
                </option>
                <option className="template-options" value={2}>
                  Template 2
                </option>
                <option className="template-options" value={3}>
                  Template 3
                </option>
                <option className="template-options" value={4}>
                  Template 4
                </option>
                <option className="template-options" value={5}>
                  Template 5
                </option>
              </select>
              {/*<a href="www.google.com">View Templates</a>*/}
              <Button
                className="send-btn"
                children={
                  isLoading ? <Loader backgroundColor="white" /> : "Send"
                }
                type="Submit"
              />
            </Container>
          </div>
        </form>
      )}
    </div>
  );
}

export default AddInterview;

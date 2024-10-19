import { Fragment, useState } from "react";
import React from "react";
import Navbar from "../Components/navbar/Navbar";
import "./Register.css";
import Input from "../Components/Input";
import { useForm } from "react-hook-form";
import Button from "../Components/Button";
import Container from "../Components/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { apiRoutes } from "../services/apiRoutes.js";
import {
  faPhone,
  faUsers,
  faUser,
  faEnvelope,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { axiosPost } from "../services/axios.config";

function Register() {

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      phoneNo: "",
      companyName: "",
      email: "",
      employee: "",
    },
  });

  const { register: emailRegister, handleSubmit: handleVerifyEmail } = useForm({
    defaultValues: {
      emailOTP: "",
    },
  });

  const { register: phoneRegister, handleSubmit: handleVerifyPhone } = useForm({
    defaultValues: {
      phoneOTP: "",
    },
  });

  const [isProceedClick, setIsProcedClick] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [isVerified, setIsVerified] = useState({
    phone: false,
    email: false,
  });

  const registerCompany = async (data) => {

    if (!isLoading) {
      setIsLoading(true);  

      const responseData = await axiosPost(
        `${import.meta.env.VITE_CUVETTE_JOB_POST_API_URL}${
          apiRoutes.REGISTER_COMPANY
        }`,
        data
      );

      console.log(responseData);

      setIsLoading(false);
    }

    // setIsProcedClick(!isProceedClick);
  };

  const registerCompanyError = (error) => {
    console.log(error);

    const { name, email, phoneNo, companyName, employee } = error;

    if (name) {
      toast.error("Please Enter name !");
    } else {
      if (phoneNo) {
        toast.error(
          phoneNo.message || "Please Enter phone no with country code !"
        );
      } else {
        if (companyName) {
          toast.error("Please Enter Compnay Name !");
        } else {
          if (email) {
            toast.error(
              email.message || "Please Enter email of company properly !"
            );
          } else {
            toast.error(employee.message || "Please enter employee size !");
          }
        }
      }
    }
  };

  const verifyEmail = () => {
    setIsVerified((prev) => {
      return { ...prev, email: true };
    });
  };

  const verifyEmailError = (error) => {
    console.log(error);

    toast.error(error.emailOTP.message);
  };

  const verifyPhone = () => {
    setIsVerified((prev) => {
      return { ...prev, phone: true };
    });
  };

  const verifyPhoneError = (error) => {
    toast.error(error.phoneOTP.message);
  };

  return (
    <Fragment>
      <Navbar />
      <section>
        <div className="auth-section">
          <div className="register-text">
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley
            </p>
          </div>
          <div className="auth-main-hero-div">
            <div className="auth-inner-div">
              <div style={{ paddingBottom: "3rem" }}>
                <div className="heading-text">Sign Up</div>
                <div className="heading-desc">
                  Lorem Ipsum is simply dummy text
                </div>
              </div>

              {!isProceedClick && (
                <form
                  onSubmit={handleSubmit(registerCompany, registerCompanyError)}
                  noValidate
                >
                  <div className="auth-main-div">
                    <Container classname="input-div-container">
                      <div>
                        <FontAwesomeIcon icon={faUser} size="xl" />
                      </div>
                      <Input
                        className="input-fields"
                        id="name"
                        type="text"
                        placeholder="Name"
                        {...register("name", { required: true })}
                      />
                    </Container>
                    <Container classname="input-div-container">
                      <div>
                        <FontAwesomeIcon icon={faPhone} size="xl" />
                      </div>
                      <Input
                        className="input-fields"
                        id="phoneNo"
                        type="text"
                        placeholder="Phone"
                        {...register("phoneNo", {
                          required: true,
                          maxLength: 13,
                          minLength: 13,
                          pattern: {
                            value:
                              /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                            message:
                              "Only numbers are allowed in phone number !",
                          },
                        })}
                      />
                    </Container>
                    <Container classname="input-div-container">
                      <div>
                        <FontAwesomeIcon icon={faUser} size="xl" />
                      </div>
                      <Input
                        className="input-fields"
                        id="companyName"
                        type="text"
                        placeholder="Company Name"
                        {...register("companyName", {
                          required: true,
                        })}
                      />
                    </Container>
                    <Container classname="input-div-container">
                      <div>
                        <FontAwesomeIcon icon={faEnvelope} size="xl" />
                      </div>
                      <Input
                        className="input-fields"
                        id="email"
                        type="email"
                        placeholder="Company Email"
                        {...register("email", {
                          required: true,
                          pattern: {
                            value:
                              /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                            message: "Please enter valid mail ID",
                          },
                        })}
                      />
                    </Container>
                    <Container classname="input-div-container">
                      <div>
                        <FontAwesomeIcon icon={faUsers} size="xl" />
                      </div>
                      <Input
                        className="input-fields"
                        id="employee"
                        type="text"
                        placeholder="Employee Size"
                        {...register("employee", {
                          required: true,
                          validate: (value) => {
                            if (value <= 0) {
                              return "Please enter employee size greater than 0 !";
                            }
                            return true;
                          },
                        })}
                      />
                    </Container>

                    <div>
                      <p style={{ textAlign: "center", fontSize: "1.5rem" }}>
                        By clicking on proceed you wil accept our <br />
                        <span style={{ color: "blue", fontSize: "1.3rem" }}>
                          Terms & Conditions
                        </span>
                      </p>
                    </div>

                    <Container>
                      <Button
                        className="submit-btn"
                        children="Proceed"
                        type="Submit"
                      />
                    </Container>
                  </div>
                </form>
              )}

              {isProceedClick && (
                <div className="auth-main-div">
                  <form
                    onSubmit={handleVerifyEmail(verifyEmail, verifyEmailError)}
                  >
                    <Container classname="input-div-container">
                      <div>
                        <FontAwesomeIcon icon={faEnvelope} size="xl" />
                      </div>
                      <Input
                        className="input-fields"
                        id="name"
                        type="text"
                        placeholder="Email OTP"
                        {...emailRegister("emailOTP", {
                          required: "Please enter Email OTP",

                          minLength: {
                            value: 6,
                            message:
                              "Email OTP must be at least 6 characters long",
                          },
                          maxLength: {
                            value: 6,
                            message:
                              "Email OTP must be at least 6 characters long",
                          },
                        })}
                      />
                      {isVerified.email && (
                        <div className="verify-div" style={{}}>
                          <FontAwesomeIcon
                            icon={faCheck}
                            style={{ color: "#fff" }}
                            size="2xl"
                          />
                        </div>
                      )}
                    </Container>

                    {!isVerified.email && (
                      <Container style={{ marginTop: "1rem" }}>
                        <Button
                          className="submit-btn"
                          children="Verify"
                          type="Submit"
                        />
                      </Container>
                    )}
                  </form>
                  <form
                    onSubmit={handleVerifyPhone(verifyPhone, verifyPhoneError)}
                  >
                    <Container classname="input-div-container">
                      <div>
                        <FontAwesomeIcon icon={faPhone} size="xl" />
                      </div>
                      <Input
                        className="input-fields"
                        id="name"
                        type="text"
                        placeholder="Phone OTP"
                        {...phoneRegister("phoneOTP", {
                          required: "Please enter Phone OTP",
                          minLength: {
                            value: 6,
                            message:
                              "Phone OTP must be at least 6 characters long",
                          },
                          maxLength: {
                            value: 6,
                            message:
                              "Phone OTP must be at least 6 characters long",
                          },
                        })}
                      />
                      {isVerified.phone && (
                        <div className="verify-div" style={{}}>
                          <FontAwesomeIcon
                            icon={faCheck}
                            style={{ color: "#fff" }}
                            size="2xl"
                          />
                        </div>
                      )}
                    </Container>

                    {!isVerified.phone && (
                      <Container style={{ marginTop: "1rem" }}>
                        <Button
                          className="submit-btn"
                          children="Verify"
                          type="Submit"
                        />
                      </Container>
                    )}
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
}

export default Register;

// <Button
//                   disable={true}
//                   type="submit"
//                   className="signup-btn"
//                   children={isLoading ? <div class="loader"></div> : "Sign-Up"}
//                 />

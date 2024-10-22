import { Fragment, useState, useEffect } from "react";
import React from "react";
import Navbar from "../../Components/navbar/Navbar.jsx";
import "./Register.css";
import Input from "../../Components/Input.jsx";
import { useForm } from "react-hook-form";
import Button from "../../Components/Button.jsx";
import Container from "../../Components/Container.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { apiRoutes } from "../../services/apiRoutes.js";
import {
  faPhone,
  faUsers,
  faUser,
  faEnvelope,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { axiosGet, axiosPost } from "../../services/axios.config.js";
import Loader from "../../Components/Loader/Loader.jsx";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verify } from "../../Feature/adminSlice.js";
import setToken from "../../utils/setToken.js";
import { auth } from "../../firebase/firebaseConfig.js";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

function Register() {
  const navigator = useNavigate();

  const dispatch = useDispatch();

  const [otpVerification, setOtpVerification] = useState();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigator("/company");
    }
  });

  //#region firebase

  async function setUpRecaptha(number) {
    let recaptchaVerifier;

    if (isLoginClick) {
      recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-2", {
        size: "invisible",
        callback: (response) => {
          onSignInSubmit();
        },
      });
    } else {
      recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-1", {
        size: "invisible",
        callback: (response) => {
          onSignInSubmit();
        },
      });
    }

    // Add this for render captcha :  recaptchaVerifier.render();
    // signInWithPhoneNumber(auth, number, recaptchaVerifier);

    return signInWithPhoneNumber(auth, number, recaptchaVerifier)
      .then((confirmationResult) => {
        return confirmationResult;
      })
      .catch((error) => {
        console.error("Error sending OTP:", error);
        throw error;
      });
  }

  const getOtp = async (phoneNumber) => {
    if (phoneNumber === "" || phoneNumber === undefined) {
      toast.error("mobile_num is required");
      return;
    }

    try {
      const response = await setUpRecaptha(phoneNumber);

      return response;
    } catch (err) {
      if (err) {
        setIsVerified((prev) => ({ ...prev, phone: false }));
        toast.error(err);
      }
    }
  };

  const verifyOtp = async (otp) => {

    if (otp === "" || otp === null) return alert("otp must required");
    try {
      otpVerification.confirm(otp).then(async (result) => {
        setIsVerified((prev) => ({ ...prev, phone: true }));
        toast.success("done");
        await compnyVerification(true, isVerified.email);
      });
    } catch (err) {
      toast.error("Please enter valid OTP");
    }
  };

  //#endregion

  //#region  state variable
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      phoneNo: "",
      companyName: "",
      email: "",
      employee: "",
    },
  });

  const { register: login, handleSubmit: handleLogin } = useForm({
    defaultValues: {
      registeredPhoneNo: "",
      registeredEmail: "",
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

  const [isLoginClick, setIsLoginClick] = useState(false);

  const [isLoading, setIsLoading] = useState({
    register: false,
    email: false,
    phone: false,
  });

  const [isVerified, setIsVerified] = useState({
    phone: false,
    email: false,
  });

  const [companyId, setCompanyId] = useState(null);
  //#endregion

  //#region Register Company
  const registerCompany = async (data) => {
    if (!isLoading.register) {
      setIsLoading((prev) => ({ ...prev, register: true }));

      const responseData = await axiosPost(
        `${import.meta.env.VITE_CUVETTE_JOB_POST_API_URL}${
          apiRoutes.REGISTER_COMPANY
        }`,
        data
      );

      const result = await getOtp(data.phoneNo);
     

      if (responseData.success && result) {
        toast.success(responseData.message);
        setCompanyId(responseData.data._id);
        setOtpVerification(result);
        setIsProcedClick(true);
      } else {
        if (result) {
          toast.error(responseData.message);
        } else {
          toast.error(
            "Getting Error while generating OTP ! Please try letter or refresh page !"
          );
        }
      }

      setIsLoading((prev) => ({ ...prev, register: false }));
    }
  };

  const registerCompanyError = (error) => {
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

  //#endregion

  const compnyVerification = async (phone, email) => {

    if ((isVerified.phone || phone) && (isVerified.email || email)) {
      const responseData = await axiosGet(
        `${import.meta.env.VITE_CUVETTE_JOB_POST_API_URL}${
          apiRoutes.VERIFY_COMPANY
        }`.replace(":companyId", companyId),
        {
          companyId,
        }
      );


      if (responseData.success) {
        const { accessToken, refreshToken, company } = responseData.data;
        dispatch(verify(company.name));
        setToken(accessToken, refreshToken);
        navigator("/company");
      }
    }
  };

  //#region verify email
  const verifyEmail = async (data) => {
    if (!isLoading.email) {
      setIsLoading((prev) => ({ ...prev, email: true }));

      const responseData = await axiosPost(
        `${import.meta.env.VITE_CUVETTE_JOB_POST_API_URL}${
          apiRoutes.VERIFY_EMAIL_OTP
        }`,
        {
          companyId,
          otp: data.emailOTP,
        }
      );

      if (responseData.success) {
        setIsVerified((prev) => ({ ...prev, email: true }));

        toast.success("done");

        await compnyVerification(isVerified.phone, true);
      } else {
        toast.error("Wrong OTP !! Please try again !");
      }

      setIsLoading((prev) => ({ ...prev, email: false }));
    }
  };

  const verifyEmailError = (error) => {
    toast.error(error.emailOTP.message);
  };

  //#endregion

  //#region verify phone

  const verifyPhone = async (data) => {
    if (!isLoading.phone) {
      setIsLoading((prev) => {
        return { ...prev, phone: true };
      });

      await verifyOtp(data.phoneOTP);

      setIsLoading((prev) => {
        return { ...prev, phone: false };
      });
    }
  };

  const verifyPhoneError = (error) => {
    toast.error(error.phoneOTP.message);
  };

  //#endregion

  //#region login company

  const loginCompany = async (data) => {
    if (!isLoading.login) {
      setIsLoading((prev) => ({ ...prev, login: true }));

      const responseData = await axiosPost(
        `${import.meta.env.VITE_CUVETTE_JOB_POST_API_URL}${
          apiRoutes.LOGIN_COMPANY
        }`,
        data
      );

      const responseOfPhoneOTP = await getOtp(data.registeredPhoneNo);

      if (responseData.success && responseOfPhoneOTP) {
        toast.success(responseData.message);
        setOtpVerification(responseOfPhoneOTP);
        setCompanyId(responseData.data._id);
        setIsProcedClick(true);
      } else {
        if (!responseOfPhoneOTP) {
          toast.error("Error occured while sending OTP to your Phone Number !");
        } else {
          toast.error(responseData.message);
        }
      }

      setIsLoading((prev) => ({ ...prev, login: false }));
    }
  };

  const loginCompanyError = (error) => {
    const { registeredPhoneNo, registeredEmail } = error;

    if (registeredPhoneNo) {
      toast.error(registeredPhoneNo.message);
    } else {
      toast.error(registeredEmail.message);
    }
  };

  //#endregion

  return (
    <Fragment>
      <Navbar />
      <section>
        <div id="recaptcha-1"></div>
        <div id="recaptcha-2"></div>

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
                <div className="heading-text">
                  {isLoginClick ? "Login " : "Sign Up"}
                </div>
                <div className="heading-desc">
                  Lorem Ipsum is simply dummy text
                </div>
              </div>

              {!isProceedClick && (
                <div>
                  {!isLoginClick && (
                    <form
                      onSubmit={handleSubmit(
                        registerCompany,
                        registerCompanyError
                      )}
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
                          <p
                            style={{ textAlign: "center", fontSize: "1.5rem" }}
                          >
                            By clicking on proceed you wil accept our <br />
                            <span style={{ color: "blue", fontSize: "1.3rem" }}>
                              Terms & Conditions
                            </span>
                          </p>
                        </div>

                        <Container>
                          <Button
                            className="submit-btn"
                            children={
                              isLoading.register ? (
                                <Loader backgroundColor="white" />
                              ) : (
                                "Proceed"
                              )
                            }
                            type="Submit"
                          />
                        </Container>
                      </div>
                    </form>
                  )}

                  {isLoginClick && (
                    <form
                      onSubmit={handleLogin(loginCompany, loginCompanyError)}
                      noValidate
                    >
                      <div className="login-div">
                        <Container classname="input-div-container">
                          <div>
                            <FontAwesomeIcon icon={faPhone} size="xl" />
                          </div>
                          <Input
                            className="input-fields"
                            id="registeredPhoneNo"
                            type="text"
                            placeholder="Enter register phone number ..."
                            {...login("registeredPhoneNo", {
                              required:
                                "Please enter your registered Phone Number !",
                              pattern: {
                                value:
                                  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                                message:
                                  "Only numbers are allowed in phone number !",
                              },
                              validate: (value) => {
                                const countryCodeRegex = /^\+\d{1,3}/;
                                return (
                                  countryCodeRegex.test(value) ||
                                  "Please enter number with country code !"
                                );
                              },
                            })}
                          />
                        </Container>
                        <Container classname="input-div-container">
                          <div>
                            <FontAwesomeIcon icon={faEnvelope} size="xl" />
                          </div>
                          <Input
                            className="input-fields"
                            id="registeredEmail"
                            type="email"
                            placeholder="Enter registered email ...."
                            {...login("registeredEmail", {
                              required: "Please enter your registered email !",
                              pattern: {
                                value:
                                  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                message: "Please enter valid mail ID",
                              },
                            })}
                          />
                        </Container>

                        <div>
                          <p
                            style={{ textAlign: "center", fontSize: "1.5rem" }}
                          >
                            By clicking on proceed you wil accept our <br />
                            <span style={{ color: "blue", fontSize: "1.3rem" }}>
                              Terms & Conditions
                            </span>
                          </p>
                        </div>
                        <Container>
                          <Button
                            className="submit-btn"
                            children={
                              isLoading.login ? (
                                <Loader backgroundColor="white" />
                              ) : (
                                "Send OTP"
                              )
                            }
                            type="Submit"
                          />
                        </Container>
                      </div>
                    </form>
                  )}

                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingTop: "1rem",
                    }}
                  >
                    <Button
                      className="login-btn"
                      children={
                        isLoginClick
                          ? "Create Account / Register with us"
                          : "Already registered with us ?"
                      }
                      onClick={() => setIsLoginClick(!isLoginClick)}
                    />
                  </div>
                </div>
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
                          children={
                            isLoading.email ? (
                              <Loader backgroundColor="white" />
                            ) : (
                              "Verify"
                            )
                          }
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
                          children={
                            isLoading.phone ? (
                              <Loader backgroundColor="white" />
                            ) : (
                              "Verify"
                            )
                          }
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

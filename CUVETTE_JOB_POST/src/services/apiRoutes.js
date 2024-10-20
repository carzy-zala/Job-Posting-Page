export const apiRoutes = {
  // registration
  REGISTER_COMPANY: "/company/register",
  VERIFY_COMPANY: "/company/verify/:companyId",
  VERIFY_EMAIL_OTP: "/company/verify/email",
  LOGIN_COMPANY: "/company/login",
  LOGOUT: "/company/logout",

  // interview
  CREATE_INTERVIEW : "/interview/addInterview",
  FETCH_INTERVIEW : "/interview/",
  DELETE_INTERVIEW : "/interview/delete/:interviewId"
};

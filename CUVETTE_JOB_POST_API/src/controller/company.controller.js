import asyncHandler from "../util/asyncHandler.js";
import ApiError from "../util/ApiError.js";
import ApiResponse from "../util/ApiResponse.js";
import { Company } from "../model/company.model.js";
import { sendOTPMail } from "../util/otpSender.js";
import { OTP } from "../model/otp.model.js";

//#region generateToken
const generateAccessAndRefreshToken = async (companyId) => {
  try {
    const company = await Company.findById(companyId);
    const accessToken = company.generateAccessToken();
    const refreshToken = company.generateRefreshToken();

    company.refreshToken = refreshToken;
    await company.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "ERROR :: Something went wrong while generating access and refresh tokens !!",
    );
  }
};
//#endregion

//#region generate OTP

const generateOTP = (length = 6) => {
  const characters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let otp = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }

  return otp;
};

const saveOTP = async (companyId, otp) => {
  try {
    const existedCompany = await OTP.findOne({ companyId });

    if (existedCompany) {
      existedCompany.otp = otp;
      await existedCompany.save({ validateBeforeSave: false });
    } else {
      await OTP.create({ companyId, otp });
    }
  } catch {
    throw new ApiError(500, "ERROR :: Internal server error !");
  }
};
//#endregion

//#region Register user

const register = asyncHandler(async (req, res) => {
  const { name, email, phoneNo, companyName, employee } = req.body;

  if (
    !name ||
    name.trim() === "" ||
    !email ||
    email.trim() === "" ||
    !phoneNo ||
    phoneNo.trim() === "" ||
    !companyName ||
    companyName.trim() === "" ||
    !employee ||
    employee.trim() === ""
  ) {
    throw new ApiError(
      400,
      "ERROR :: All fields name, email, phoneNo,companyName and employee are can't be empty",
    );
  }

  const existedCompany = await Company.findOne({ email, phoneNo });

  if (existedCompany) {
    if (!existedCompany.isVerified) {
      const generatedOTP = generateOTP(8);

      await sendOTPMail(email, generatedOTP);

      await saveOTP(existedCompany._id, generatedOTP);

      return res
        .status(200)
        .json(
          new ApiResponse(
            201,
            existedCompany,
            "Compnay already registered, Please verify !",
          ),
        );
    }

    throw new ApiError(
      409,
      "ERROR :: Either your email or password already registered with us !",
    );
  }

  const company = await Company.create({
    name,
    email,
    phoneNo,
    companyName,
    employee,
  });

  const createdCompany = await Company.findById(company._id).select(
    "-refreshToken",
  );

  if (!createdCompany) {
    throw new ApiError(
      500,
      "ERROR :: Something went wrong while registering the company",
    );
  }

  const generatedOTP = generateOTP(8);

  await sendOTPMail(email, generatedOTP);

  await saveOTP(createdCompany._id, generatedOTP);

  res
    .status(201)
    .json(
      new ApiResponse(201, createdCompany, "Compnay registered succesfully"),
    );
});

//#endregion

//#region login user

const login = asyncHandler(async (req, res) => {
  const { registeredPhoneNo: phoneNo, registeredEmail: email } = req.body;

  if (!email || email.trim() === "" || !phoneNo || phoneNo.trim() === "") {
    throw new ApiError(
      400,
      "ERROR :: Please make sure Phone Number and Email are not empty",
    );
  }

  const existedCompany = await Company.findOne({ email, phoneNo });

  if (!existedCompany) {
    throw new ApiError(409, "ERROR :: Sorry you are not registered with us !");
  }

  const generatedOTP = generateOTP(8);

  await sendOTPMail(email, generatedOTP);

  await saveOTP(existedCompany._id, generatedOTP);

  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        existedCompany,
        "Compnay already registered, Please verify !",
      ),
    );
});

//#endregion

//#region verifyEmailOTP
export const verifyEmailOTP = asyncHandler(async (req, res) => {
  const { otp, companyId } = req.body;

  const company = await OTP.findOne({ companyId });

  if (!company) {
    throw new ApiError(
      401,
      "ERROR :: Invalid try please register your company details",
    );
  }

  if (otp !== company.otp) {
    throw new ApiError(401, "ERROR :: Please enter valid OTP");
  }

  const tempId = company._id;
  await OTP.findByIdAndDelete(tempId);

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Email is verify succesfully !"));
});

//#endregion

//#region verify company
export const verifyCompany = asyncHandler(async (req, res) => {
  const { companyId } = req.params;

  const company = await Company.findById(companyId);

  if (!company) {
    throw new ApiError(401, "Invalid request !");
  }

  company.isVerified = true;
  await company.save({ validateBeforeSave: false });

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    company._id,
  );

  const loggedInCompany = await Company.findById(company._id);

  const options = {
    htttpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
          refreshToken,
          company: loggedInCompany,
        },
        "Verified in successfully",
      ),
    );
});
//#endregion

//#region logout
const logoutCompany = asyncHandler(async (req, res) => {
  await Company.findByIdAndUpdate(
    req.company._id,
    {
      $set: { isVerified: false },
    },
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    },
  );

  const options = {
    htttpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out succesfully "));
});

//#endregion

export { register, logoutCompany, login };

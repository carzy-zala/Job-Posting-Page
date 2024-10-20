import asyncHandler from "../util/asyncHandler.js";
import ApiError from "../util/ApiError.js";
import ApiResponse from "../util/ApiResponse.js";
import Interview from "../model/interview.model.js";
import sendInvite from "../util/invitemail.js";

const getMessage = (job) => {
  const { title, description, experienceLevel, endDate, templateNo } = job;

  switch (templateNo) {
    case "1":
      return {
        subject: `TEMPLATE 1 :Invitation to Apply for ${title} `,
        message: `Hii Dear,
  
We hope this message finds you well. We are excited to announce an opening for the position of ${title}.
  
${description}

Below are the details of the job:

Job Description:${description}

Experience Level:${experienceLevel}

Application Deadline:${endDate} (YYYY/MM/DD)

We believe your skills and experience could be a great match for our team. If you’re interested, please submit your application by the deadline.

Best regards,   
${title}
`,
      };
    case "2":
      return {
        subject: `TEMPLATE 2 :Invitation to Apply for ${title} `,
        message: `Hii Dear,
  
We hope this message finds you well. We are excited to announce an opening for the position of ${title} at 
  
${description}

Below are the details of the job:

Job Description:${description}

Experience Level:${experienceLevel}

Application Deadline:${endDate} (YYYY/MM/DD)

We believe your skills and experience could be a great match for our team. If you’re interested, please submit your application by the deadline.

Best regards,   
${title}
`,
      };
    case "3":
      return {
        subject: `TEMPLATE 3 :Invitation to Apply for ${title} `,
        message: `Hii Dear,
  
We hope this message finds you well. We are excited to announce an opening for the position of ${title} at 
  
${description}

Below are the details of the job:

Job Description:${description}

Experience Level:${experienceLevel}

Application Deadline:${endDate} (YYYY/MM/DD)

We believe your skills and experience could be a great match for our team. If you’re interested, please submit your application by the deadline.

Best regards,   
${title}
`,
      };
    case "4":
      return {
        subject: `TEMPLATE 4 :Invitation to Apply for ${title} `,
        message: `Hii Dear,
  
We hope this message finds you well. We are excited to announce an opening for the position of ${title} at 
  
${description}

Below are the details of the job:

Job Description:${description}

Experience Level:${experienceLevel}

Application Deadline:${endDate} (YYYY/MM/DD)

We believe your skills and experience could be a great match for our team. If you’re interested, please submit your application by the deadline.

Best regards,   
${title}
`,
      };
    case "5":
      return {
        subject: `TEMPLATE 5 :Invitation to Apply for ${title} `,
        message: `Hii Dear,
  
We hope this message finds you well. We are excited to announce an opening for the position of ${title} at 
  
${description}

Below are the details of the job:

Job Description:${description}

Experience Level:${experienceLevel}

Application Deadline:${endDate} (YYYY/MM/DD)

We believe your skills and experience could be a great match for our team. If you’re interested, please submit your application by the deadline.

Best regards,   
${title}
`,
      };
  }
};

export const addInterview = asyncHandler(async (req, res) => {
  const { title, description, experienceLevel, endDate, invitedCandidates } =
    req.body;

  const companyId = req.company._id

  if (
    !title ||
    title.trim() === "" ||
    !description ||
    description.trim() === "" ||
    !experienceLevel ||
    experienceLevel.trim() === ""
  ) {
    throw new ApiError(
      401,
      "ERROR :: Please make sure title is added for job.",
    );
  }

  const createdInterview = await Interview.create({
    title,
    description,
    experienceLevel,
    endDate,
    invitedCandidates: invitedCandidates || [],
    companyId
  });

  const message = getMessage(req.body);

  if (invitedCandidates.length) {
    await sendInvite(invitedCandidates, message);
  }

  
  res
    .status(200)
    .json(new ApiResponse(200, createdInterview, "Job created succesfully !"));
});

export const getInterviews = asyncHandler(async (req, res) => {
  const companyId = req.company._id;

  const interviews = await Interview.find({ companyId });

  res
    .status(200)
    .json(new ApiResponse(200, { interviews }, "Your all interviews"));
});

export const deleteInterview = asyncHandler(async (req, res) => {
  const { interviewId } = req.params;

  await Interview.findByIdAndDelete(interviewId);

  res.status(200).json(new ApiResponse(200, {}, "Interview delete succefully"));
});

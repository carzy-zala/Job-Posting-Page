import asyncHandler from "../util/asyncHandler.js";
import ApiError from "../util/ApiError.js";
import ApiResponse from "../util/ApiResponse.js";
import Interview from "../model/interview.model.js";
import sendInvite from "../util/invitemail.js";

// const templates = [
//   {
//     Subject: `Invitation to Apply for ${title} at ${companyName}`,

//     message: `Hii Dear,

// We hope this message finds you well. We are excited to announce an opening for the position of ${title} at ${companyName}. Below are the details of the job:

// Job Description:${description}

// Experience Level:${experienceLevel}

// Application Deadline:${endData}

// We believe your skills and experience could be a great match for our team. If you’re interested, please submit your application by the deadline.

// Best regards,
// ${title}
// ${companyName}
// `,
//   },
//   {
//     Subject: ` Exciting Opportunity: ${title} at ${companyName}`,
//     message: `Hi ,

// I came across your profile and was impressed by your experience. We have a job opening for ${title} at ${companyName} and thought you might be a great fit.

// Job Description:
// ${description}

// Experience Level:
// ${experienceLevel}

// Application Deadline:
// ${endDate}

// If you’re interested, I would love to discuss this opportunity further with you.

// Looking forward to hearing from you!

// Best,
// ${title}
// ${companyName}`,
//   },
//   {
//     Subject: `Job Opportunity: ${title} at ${companyName}`,
//     message: `Dear Candidate,

// We are pleased to invite you to apply for the ${title} position at ${companyName}. Please find the job details below:

// Job Description:
// ${description}

// Experience Level:
// ${experienceLevel}

// Application Deadline:
// ${endDate}

// We encourage you to submit your application if you meet the criteria. We look forward to reviewing your application.

// Sincerely,
// ${title}
// ${companyName}
// `,
//   },
//   {
//     Subject: `Join Us as a ${title}!`,
//     message: `Hey Candidate,

// Hope you’re doing well! We have an opening for a ${title} at ${companyName}, and I thought you might be interested.

// Job Description:
// ${description}

// Experience Level:
// ${experienceLevel}

// Application Deadline:
// ${endDate}

// Let me know if you’d like to chat about this opportunity!

// Cheers,
// ${title}
// ${companyName}

// `,
//   },
//   {
//     Subject: `Apply Now for ${title} at ${companyName}`,
//     message: `Dear Candidate,

// We have an urgent opening for the position of ${title} at ${companyName} and would love for you to consider applying. Here are the details:

// Job Description:
// ${description}

// Experience Level:
// ${experienceLevel}

// Application Deadline:
// ${endDate}

// If you are interested, please submit your application as soon as possible, as we are looking to fill this position quickly.

// Thank you!
// ${title}
// ${companyName} `,
//   },
// ];

const getMessage = (job) => {
  const {
    title,
    companyName,
    description,
    experienceLevel,
    endDate,
    templateNo,
  } = job;


  switch (templateNo) {
    case 1:

      return {
        subject: `Invitation to Apply for ${title} at ${companyName}`,

        message: `Hii Dear,
  
  We hope this message finds you well. We are excited to announce an opening for the position of ${title} at ${companyName}. Below are the details of the job:
  
  Job Description:${description}
  
  Experience Level:${experienceLevel}
  
  Application Deadline:${endDate}
  
  We believe your skills and experience could be a great match for our team. If you’re interested, please submit your application by the deadline.
  
  Best regards,   
  ${title}
  ${companyName}  
  `,
      };
  }
};

export const addInterview = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    experienceLevel,
    endDate,
    invitedCandidates,
    templateNo,
  } = req.body;

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
  });


  const message = getMessage(req.body);


  if (invitedCandidates.length) {
    await sendInvite(invitedCandidates, message);
  }

  res
    .status(200)
    .json(new ApiResponse(200, createdInterview, "Job created succesfully !"));
});

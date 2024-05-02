import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import { Link, Form } from "react-router-dom";
import Wrapper from "../assets/wrappers/Job";
import JobInfo from "./JobInfo"; 
import day from "dayjs"; // This helps change mongodb date into a custom date for frontend use
import advancedFormat from "dayjs/plugin/advancedFormat";
day.extend(advancedFormat);

const Job = ({
  _id,
  position,
  company,
  jobLocation,
  jobType,
  createdAt,
  jobStatus,
}) => {
  // console.log(createdAt);
  const date = day(createdAt).format("MMM Do, YYYY"); // Changing mongodb date into custom date

  return (
    <Wrapper>
      <header>
        <div className="main-icon">{company.charAt(0)}</div>

        <div className="info">
          <Link to={`../view-job/${_id}`}>
            <h5>{position}</h5>
          </Link>
          <p>{company}</p>
        </div>
      </header>

      <div className="content">
        <div className="content-center">
          <JobInfo icon={<FaLocationArrow />} text={jobLocation} />
          <JobInfo icon={<FaCalendarAlt />} text={date} />
          <JobInfo icon={<FaBriefcase />} text={jobType} />
          <div className={`status ${jobStatus}`}>{jobStatus}</div>
        </div>

        <footer className="actions">
          <Link to={`../edit-job/${_id}`} className="btn edit-btn">
            Edit
          </Link>

          <Link to={`../confirm-delete-job/${_id}`} className="btn edit-btn">
            Delete
          </Link>

          {/* <Form method="post" action={`../delete-job/${_id}`}>
            <button type="submit" className="btn delete-btn">
              Delete
            </button>
          </Form> */}
        </footer>
      </div>
    </Wrapper>
  );
};

export default Job;
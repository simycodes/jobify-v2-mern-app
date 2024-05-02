import Wrapper from "../assets/wrappers/JobsContainer.js";
import { useAllJobsContext } from "../pages/AllJobs.jsx";
import Job from "./Job.jsx";
import PageBtnContainer from "./PageBtnContainer.jsx";

const JobsContainer = () => {
  const { data } = useAllJobsContext();
  const { jobs, totalJobs, numberOfPages,  } = data;
  // console.log(jobs);
  
  if(jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No jobs to display...add some jobs!</h2>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <h5>{totalJobs} Job{jobs.length > 1? "s": ""} found </h5>

      {/* Display Jobs */}
      <div className="jobs">
        {
          jobs.map((job) => {
            return <Job key={job._id} {...job} />;
          })
        }
      </div>

      {/* Display the pagination number container */}
      {jobs.length > 1 && <PageBtnContainer />}
    </Wrapper>
  );
}
export default JobsContainer
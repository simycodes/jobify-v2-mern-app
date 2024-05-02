import { FormRow, FormRowSelect, SubmitBtn } from ".";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { Form, useSubmit, Link } from "react-router-dom";
import { JOB_TYPE, JOB_STATUS, JOB_SORT_BY } from "../../../utils/constants";
import { useAllJobsContext } from "../pages/AllJobs";

const SearchContainer = () => {
  const { searchValues } = useAllJobsContext();
  const { search, jobStatus, jobType, sort } = searchValues;
  // An instance of useSubmit is used to automatically submit a form/sends new request 
  // with new params to server when a value changes on an input
  const submit = useSubmit();

  // Debounce is a user defined function that executed after a delayed amount of time.
  // It returns a timeout function that runs the needed after a specified delay. Helps avoid too may repetitive calls to the database
  const debounce = (onChange) => {
    let timeout;

    return (e) => {
      const form = e.currentTarget.form;
      clearTimeout(timeout); // clear old timeout before invoking another one
      timeout = setTimeout(()=> {
        onChange(form);
      }, 2000)
    }
  }

  return (
    <Wrapper>
      <Form className="form">
        <h5 className="form-title">search form</h5>
        <div className="form-center">
          {/* search position */}

          <FormRow
            type="search"
            name="search"
            defaultValue={search}
            onChange={debounce((form)=> { // passing a function (named onChange in called function) not a variable
              submit(form); // Submits the form again/sends new request with new params to server whenever input values changes
            })}
          />

          <FormRowSelect
            labelText="job status"
            name="jobStatus"
            optionListValues={["all", ...Object.values(JOB_STATUS)]}
            defaultValue={jobStatus}
            onChange={(e) => {
              submit(e.currentTarget.form); // Submits the form again/sends new request with new params to server whenever input values changes
            }}
          />

          <FormRowSelect
            labelText="job type"
            name={jobType}
            optionListValues={["all", ...Object.values(JOB_TYPE)]}
            defaultValue="all"
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />

          <FormRowSelect
            name="sort"
            optionListValues={Object.values(JOB_SORT_BY)}
            defaultValue={sort}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />

          <Link to="/dashboard/all-jobs" className="btn form-btn delete-btn">
            Reset Search Values
          </Link>
        </div>
      </Form>
    </Wrapper>
  );
};

export default SearchContainer;

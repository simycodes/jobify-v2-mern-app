import { FormRow, FormRowSelect } from "../components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useLoaderData } from "react-router-dom";
import { JOB_STATUS, JOB_TYPE } from "../../../utils/constants";
import { Form, redirect, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";


// Loader to get the single job to edit
export const viewJobLoader = async ({ params }) => {
  try {
    const { data } = await axios.get(`/api/v1/jobs/${params.id}`);
    // console.log(data);
    return data;
  } catch (error) {
    toast.error(error?.response.data.msg);
    return redirect("/dashboard/all-jobs");
  }
};

// const goToEditJob = ({ params }) => {
//   return redirect(`/dashboard/edit-job/${params.id}`);
// };

// const goToDeleteJob = () => {

// }


const ViewJob = () => {
  const { job } = useLoaderData();
  // console.log(job);

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">View Job</h4>

        <div className="form-center">
          <FormRow
            type="text"
            name="position"
            defaultValue={job.position}
            disabled={true}
          />
          <FormRow
            type="text"
            name="company"
            defaultValue={job.company}
            disabled={true}
          />
          <FormRow
            type="text"
            labelText="job location"
            name="jobLocation"
            defaultValue={job.jobLocation}
            disabled={true}
          />

          <FormRowSelect
            name="jobStatus"
            labelText="job status"
            defaultValue={job.jobStatus}
            optionListValues={Object.values(JOB_STATUS)}
            disabled={true}
          />

          <FormRowSelect
            name="jobType"
            labelText="job type"
            defaultValue={job.jobType}
            optionListValues={Object.values(JOB_TYPE)}
            disabled={true}
          />

          <Link to={`../edit-job/${job._id}`} className="btn btn-block form-btn">
            Edit
          </Link>

          <Link to={`../confirm-delete-job/${job._id}`} className="btn btn-block form-btn">
            Delete
          </Link>

        </div>
      </Form>
    </Wrapper>
  );
};

export default ViewJob;

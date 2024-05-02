import { FormRow, FormRowSelect } from "../components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useLoaderData, useNavigation } from "react-router-dom";
import { JOB_STATUS, JOB_TYPE } from "../../../utils/constants";
import { Form, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

// Loader to get the single job to edit
export const confirmDeleteJobLoader = async ({ params }) => {
  try {
    const { data } = await axios.get(`/api/v1/jobs/${params.id}`);
    // console.log(data);
    return data;
  } catch (error) {
    toast.error(error?.response.data.msg);
    return redirect("/dashboard/all-jobs");
  }
};

// Action to delete a single job
export const confirmDeleteJobAction = async ({ params }) => {
  try {
    await axios.delete(`/api/v1/jobs/${params.id}`);
    toast.success("Job deleted successfully");
    return redirect("/dashboard/all-jobs");
  } catch (error) {
    toast.error(error?.response.data.msg);
    return error;
  }
};

const ConfirmDeleteJob = () => {
  const { job } = useLoaderData();
  // console.log(job);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">Confirm Job Deletion</h4>

        <div className="form-label">
          NOTE: The delete is permanent.
        </div>

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

          <button
            type="submit"
            className="btn btn-block form-btn "
            disabled={isSubmitting}
          >
            {isSubmitting ? "deleting..." : "Delete job"}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};

export default ConfirmDeleteJob;

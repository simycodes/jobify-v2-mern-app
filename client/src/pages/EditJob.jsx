import { FormRow, FormRowSelect, SubmitBtn } from "../components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useLoaderData } from "react-router-dom";
import { JOB_STATUS, JOB_TYPE } from "../../../utils/constants";
import { Form, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import customFetch from "../utils/customFetch";

// Loader to get the single job to edit
export const editJobLoader = async ({ params }) => {
  try {
    const { data } = await axios.get(`/api/v1/jobs/${params.id}`);
    // console.log(data);
    return data;
  } catch (error) {
    toast.error(error?.response.data.msg);
    return redirect("/dashboard/all-jobs");
  }
};

// Action to update a single job
export const editJobAction = async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.patch(`/jobs/${params.id}`, data);
    toast.success("Job edited successfully");
    // return redirect("/dashboard/all-jobs");
    return redirect(`../view-job/${params.id}`);
  } catch (error) {
    toast.error(error?.response.data.msg);
    return error;
  }

};

const EditJob = () => {
  const { job } = useLoaderData();
  // console.log(job);

  return (
    <Wrapper>
      <Form method="post" className="form">
        <h4 className="form-title">edit job</h4>

        <div className="form-center">
          <FormRow type="text" name="position" defaultValue={job.position} />
          <FormRow type="text" name="company" defaultValue={job.company} />
          <FormRow
            type="text"
            labelText="job location"
            name="jobLocation"
            defaultValue={job.jobLocation}
          />

          <FormRowSelect
            name="jobStatus"
            labelText="job status"
            defaultValue={job.jobStatus}
            optionListValues={Object.values(JOB_STATUS)}
          />

          <FormRowSelect
            name="jobType"
            labelText="job type"
            defaultValue={job.jobType}
            optionListValues={Object.values(JOB_TYPE)}
          />

          <SubmitBtn formBtn />
        </div>
      </Form>
    </Wrapper>
  );
};

export default EditJob;

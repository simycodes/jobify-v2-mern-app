import { Form, redirect, useNavigation, Link, useActionData } from "react-router-dom";
import StyledSectionWrapper from "../assets/wrappers/RegisterAndLoginPage";
import { Logo, FormRow } from "../components";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

// This function handles react router dom form submissions - this function is initialized
// to the action property in the app router - formAPI (formData()) is used to get form data
export const registerAction = async({ request })=> {
  const formData = await request.formData();
  const data = Object.fromEntries(formData); // convert arrays of arrays into json 
  // console.log(data);
  // Validate Incoming data on front end - optional as required is used on front end and server validation is implemented
  const errors = { msg: "" };
  if (data.password.length < 8) {
    errors.msg = "password too short - at least 8 characters";
    return errors; // errors will be accessed by useActionData hook from react-router-doom
  }

  try {
    await customFetch.post("/auth/register", data);
    toast.success("Registration Successful");
    return redirect("/login"); // redirect recommended to be used only inside action functions
  } catch (error) {
    toast.error(error?.response?.data?.msg)
    return error;
  }
};

const Register = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const errors = useActionData()

  return (
    <StyledSectionWrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Register</h4>
        {/* frontend validation message panel */}
        {errors?.msg && (
          <p style={{ color: "red" }}>
            <b>{errors.msg}</b>
          </p>
        )}

        <FormRow type="text" name="name" />
        <FormRow
          type="text"
          name="lastName"
          labelText="Last Name"
        />
        <FormRow type="text" name="location" />
        <FormRow type="email" name="email" />
        <FormRow type="password" name="password" />

        <button type="submit" className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Register"}
        </button>
        <p>
          Already a member?{" "}
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </Form>
    </StyledSectionWrapper>
  );
};
export default Register;

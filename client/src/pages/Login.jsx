import { Link, Form, redirect, useNavigation, useNavigate } from "react-router-dom";
import StyledSectionWrapper from "../assets/wrappers/RegisterAndLoginPage";
import { FormRow, Logo } from "../components";
import axios from "axios";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";


// This function handles react router dom form submissions - this function is initialized
// to the action property in the app router - formAPI (formData()) is used to get form data
export const loginAction = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData); // convert arrays of arrays into json
  // console.log(data);
  try {
    await axios.post("/api/v1/auth/login", data); // await customFetch.post("/auth/login", data);
    toast.success("Login Successful");
    return redirect("/dashboard"); // redirect recommended to be used only inside action functions
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};

const Login = () => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  // Code to handle Test/Demo user login
  const navigate = useNavigate();
  const loginTestUser = async () => {
    const data = {
      email: "testUser@gmail.com",
      password: "testUser1234",
    };

    try {
      await customFetch.post("/auth/login", data);
      toast.success("Explore the app...take a test drive");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.msg);
    }
  };

  return (
    <StyledSectionWrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Login</h4>

        <FormRow type="email" name="email" />
        <FormRow type="password" name="password" />

        <button type="submit" className="btn btn-block" disabled={isSubmitting}>
          {isSubmitting? "Logging in...." : "Log In"}
        </button>

        <button type="button" className="btn btn-block" onClick={loginTestUser}>
          Explore the App
        </button>

        <p>
          Not a member yet?{" "}
          <Link to="/register" className="member-btn">
            Register
          </Link>
        </p>
      </Form>
    </StyledSectionWrapper>
  );
};
export default Login;

import { FormRow } from "../components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useOutletContext } from "react-router-dom";
import { useNavigation, Form } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import ProfilePictureHolderItem from "../components/ProfilePictureHolderItem";

export const profileAction = async ({ request }) => {
  // Since image is also being sent to the server, form data does not need to be changed
  // into json data before sending to server. Data needs to be sent in formData format directly
  const formData = await request.formData(); 

  // Check avatar-image size
  const file = formData.get("avatar");
  if (file && file.size > 500000) {
    toast.error("Image size is too large (Max 0.5 MB)");
    return null;
  }

  try {
    await customFetch.patch("/users/update-user", formData);
    toast.success("Profile updated successfully");
  } catch (error) {
    toast.error(error?.response?.data?.msg);
  }
  return null;
};

const Profile = () => {
  const { user } = useOutletContext(); // useOutletContext() gets context value provided by react router dom 
  const { name, lastName, email, location, avatar } = user;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  
  console.log(user);

  return (
    <Wrapper>

      <ProfilePictureHolderItem avatar={avatar}/>


      <Form method="post" className="form" encType="multipart/form-data">
        <h4 className="form-title">profile</h4>

        <div className="form-center">
          <div className="form-row">
            <label htmlFor="avatar" className="form-label">
              Select an image file (max 0.5 MB):
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              className="form-input"
              accept="image/*"
            />
          </div>

          <FormRow type="text" name="name" defaultValue={name} />
          <FormRow
            type="text"
            labelText="last name"
            name="lastName"
            defaultValue={lastName}
          />
          <FormRow type="email" name="email" defaultValue={email} />
          <FormRow type="text" name="location" defaultValue={location} />
          <button
            className="btn btn-block form-btn"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "submitting..." : "update profile"}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};

export default Profile;

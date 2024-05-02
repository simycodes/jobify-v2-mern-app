import Wrapper from "../assets/wrappers/ProfilePictureHolderItem";

const ProfilePictureHolderItem = ({ avatar }) => {
  const defaultAvatar =
    "https://res.cloudinary.com/drl9ppwjg/image/upload/v1714664718/nhat9unb69oqordun9yc.jpg";
  return (
    <Wrapper>
      <div className="profile-picture-holder">
        {/* {avatar? <img src={defaultAvatar} alt="profile" />: <h4>Upload Your Profile Picture</h4>} */}
        <img src={avatar || defaultAvatar} alt="profile" />
        
      </div>
    </Wrapper>
  );
};

export default ProfilePictureHolderItem;

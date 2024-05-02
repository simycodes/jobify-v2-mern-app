import styled from 'styled-components';

const Wrapper = styled.article`
  padding: 0.5rem;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  // border: 2px solid red;

  .profile-picture-holder {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    padding: 2rem;

    background: #5f2c82; /* fallback for old browsers */
    background: -webkit-linear-gradient(
      to right,
      #49a09d,
      #5f2c82
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
      to right,
      #49a09d,
      #5f2c82
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }

  img {
    height: 250px;
    width: 250px;
    border-radius: 18.5%;
    object-fit: cover;
  }
`;

export default Wrapper;

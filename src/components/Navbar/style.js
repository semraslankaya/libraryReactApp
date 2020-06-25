import styled from "styled-components";

export const NavWrapper = styled.div`
  background-color: black;
  font-family: "Poppins", sans-serif;
  form {
    background-color: #fff;
    margin-left: 40px;
    height: 40px;
    padding: 0 20px;
    border-radius: 100px;
    input {
      border: none;
    }
    input:focus {
      box-shadow: none;
    }
  }
  .nav-link {
    color: #DAC2BD !important;
    font-family: "Verda";
    font-size: 20px;
    margin-right: 5px;
  }
  .img {
    height: 60px;
    width: 80px;
  }
  .navbar-end {
    justify-content: flex-end !important;
    margin-left: auto !important;
    button {
      background-color: black;
    }
  }
`;



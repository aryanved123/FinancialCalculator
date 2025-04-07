import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import "./UserRegistrationPage.scss";
import { useRef, useState, useEffect } from "react";
import config from '../../config';
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FIRSTNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{3,23}$/;
const LASTNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]{3,23}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const UserRegistrationPage = () => {
  const navigate = useNavigate();

  // const userRef = useRef();
  const firstNameRef = useRef(null);
  const errRef = useRef();

  const [firstName, setfirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [FirstNameFocus, setFirstNameFocus] = useState(false);

  const [lastName, setlastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);
  const [LastNameFocus, setLastNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (firstNameRef.current) {
      firstNameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const result = FIRSTNAME_REGEX.test(firstName);
    console.log(result);
    console.log(firstName);
    setValidFirstName(result);
  }, [firstName]);

  useEffect(() => {
    const result = LASTNAME_REGEX.test(lastName);
    console.log(result);
    console.log(lastName);
    setValidLastName(result);
  }, [lastName]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    const result = PWD_REGEX.test(password);
    setValidPwd(result);
    const match = password === matchPwd;
    setValidMatch(match);
  }, [password, matchPwd]);

  useEffect(() => {
    setErrMsg("");
  }, [firstName, lastName, email, password, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = FIRSTNAME_REGEX.test(firstName);
    const v3 = LASTNAME_REGEX.test(lastName);
    const v2 = PWD_REGEX.test(password);
    const v4 = EMAIL_REGEX.test(email);
    if (!v1 || !v3 || !v2 || !v4) {
      setErrMsg("Invalid Entry");
      return;
    }
    console.log(firstName, lastName, email, password);
          try {
            const response = await Axios.post(
              `${config.baseURL}/auth/user/signup`,
              {
                firstName,
                lastName,
                email,
                password,
              }
            );
            if (response.data.success) {
              alert("Sign Up Successful!");
              navigate("/userlogin");
            } else {
              alert("Sign Up failed: " + response.data.message);
            }
          } catch (error) {
            console.error("An error occurred during sign up:", error);
            alert("An error occurred during sign up: " + error.response.data.message);
          }

  };

  return (
    <div className="user-registration-container">
      <p
        ref={errRef}
        className={errMsg ? "error msg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1>Register Now</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstname">
          FirstName:
          <span className={validFirstName ? "valid" : "hide"}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validFirstName || !firstName ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <input
          type="text"
          id="firstname"
          ref={firstNameRef}
          autoComplete="off"
          onChange={(e) => setfirstName(e.target.value)}
          required
          aria-invalid={validFirstName ? "false" : "true"}
          aria-describedby="fnidnote"
          onFocus={() => setFirstNameFocus(true)}
          onBlur={() => setFirstNameFocus(false)}
        />
        <p
          id="fnidnote"
          className={
            FirstNameFocus && firstName && !validFirstName
              ? "instructions"
              : "offscreen"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          4 to 24 characters.
          <br />
          Must begin with a letter.
          <br />
          Letters, numbers, underscores, hyphens allowed.
        </p>

        <label htmlFor="lastname">
          LastName:
          <span className={validLastName ? "valid" : "hide"}>
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <span className={validLastName || !lastName ? "hide" : "invalid"}>
            <FontAwesomeIcon icon={faTimes} />
          </span>
        </label>
        <input
          type="text"
          id="lastname"
          autoComplete="off"
          onChange={(e) => setlastName(e.target.value)}
          required
          aria-invalid={validLastName ? "false" : "true"}
          aria-describedby="lnidnote"
          onFocus={() => setLastNameFocus(true)}
          onBlur={() => setLastNameFocus(false)}
        />
        <p
          id="lnidnote"
          className={
            LastNameFocus && lastName && !validLastName
              ? "instructions"
              : "offscreen"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          4 to 24 characters.
          <br />
          Must begin with a letter.
          <br />
          Letters, numbers, underscores, hyphens allowed.
        </p>

        <label htmlFor="email">
          Email:
          <FontAwesomeIcon
            icon={faCheck}
            className={validEmail ? "valid" : "hide"}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={validEmail || !email ? "hide" : "invalid"}
          />
        </label>
        <input
          type="email"
          id="email"
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-invalid={validEmail ? "false" : "true"}
          aria-describedby="emailnote"
          onFocus={() => setEmailFocus(true)}
          onBlur={() => setEmailFocus(false)}
        />
        <p
          id="emailnote"
          className={
            emailFocus && email && !validEmail ? "instructions" : "offscreen"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Enter a valid email address (e.g., user@example.com)
        </p>

        <label htmlFor="password">
          Password:
          <FontAwesomeIcon
            icon={faCheck}
            className={validPwd ? "valid" : "hide"}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={validPwd || !password ? "hide" : "invalid"}
          />
        </label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={password}
          required
          aria-invalid={validPwd ? "false" : "true"}
          aria-describedby="pwdnote"
          onFocus={() => setPwdFocus(true)}
          onBlur={() => setPwdFocus(false)}
        />
        <p
          id="pwdnote"
          className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          8 to 24 characters.
          <br />
          Must include uppercase and lowercase letters, a number and a special
          character.
          <br />
          Allowed special characters:{" "}
          <span aria-label="exclamation mark">!</span>{" "}
          <span aria-label="at symbol">@</span>{" "}
          <span aria-label="hashtag">#</span>{" "}
          <span aria-label="dollar sign">$</span>{" "}
          <span aria-label="percent">%</span>
        </p>

        <label htmlFor="confirm_pwd">
          Confirm Password:
          <FontAwesomeIcon
            icon={faCheck}
            className={validMatch && matchPwd ? "valid" : "hide"}
          />
          <FontAwesomeIcon
            icon={faTimes}
            className={validMatch || !matchPwd ? "hide" : "invalid"}
          />
        </label>
        <input
          type="password"
          id="confirm_pwd"
          onChange={(e) => setMatchPwd(e.target.value)}
          value={matchPwd}
          required
          aria-invalid={validMatch ? "false" : "true"}
          aria-describedby="confirmnote"
          onFocus={() => setMatchFocus(true)}
          onBlur={() => setMatchFocus(false)}
        />
        <p
          id="confirmnote"
          className={matchFocus && !validMatch ? "instructions" : "offscreen"}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Must match the first password input field.
        </p>
        {/* </form> */}
        <button
          className="btn"
          disabled={
            !validFirstName ||
            !validLastName ||
            !validEmail ||
            !validPwd ||
            !validMatch
              ? true
              : false
          }
        >
          Sign Up
        </button>
      </form>
      <p class="register-text">
        Already registered?
        <span className="line">
          <a class="login-link" href="/userlogin">
            Log In
          </a>
        </span>
      </p>
    </div>
  );
};

export default UserRegistrationPage;

import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";

const LogInReg = () => {
  const { isLoggedIn, getUser } = useContext(AuthContext);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const [newPasswordTrue, setNewPasswordTrue] = useState(false);
  const [reactivate, setReactivate] = useState(false);

  const [userData, setUserdata] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [waitingForVerification, setWaitingForVerification] = useState(false);
  const [signUp, setSignUp] = useState(false);

  const APIKEY = import.meta.env.VITE_API_KEY;
  const URL = import.meta.env.VITE_BACKEND_URL;

  const handleLogIn = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
          "api-key": APIKEY,
        },
        credentials: "include",
        body: JSON.stringify({
          emailOrUsername: emailOrUsername.toLowerCase(),
          password,
        }),
      });

      const data = await response.json();
      if (response.status === 200) {
        await getUser();
      }
      if (response.status !== 200) {
        console.log("Login failed:" + " " + data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (userData.password === passwordTwo) {
      try {
        const response = await fetch(`${URL}/user/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
            "api-key": APIKEY,
          },
          credentials: "include",
          body: JSON.stringify(userData),
        });
        const data = await response.json();

        if (response.status !== 201) {
          console.log("Sign up failed");
        } else {
          console.log("Sign up successfully");
          setWaitingForVerification(true);
          setTimeout(() => {
            setWaitingForVerification(false);
            setSignUp(false);
          }, 5000);
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      setUserdata({ ...userData, password: "" });
      setPasswordTwo("");
      console.log("Passwords are not the same");
    }
  };

  const googleLogin = async () => {
    window.location.href = `${URL}/auth/login/google`;
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();
    if (password === passwordTwo) {
      console.log(userData);
      try {
        const response = await fetch(`${URL}/user/changePW`, {
          method: "POST",
          headers: {
            "Content-Type": "Application/json",
            "api-key": APIKEY,
          },
          credentials: "include",
          body: JSON.stringify({ email: emailOrUsername, password }),
        });
        const data = await response.json();

        if (response.status !== 201) {
          console.log("change password failed");
        } else {
          console.log(data.message);

          setWaitingForVerification(true);
          setTimeout(() => {
            setWaitingForVerification(false);
            setSignUp(false);
            setNewPasswordTrue(false);
            setPassword("");
            setPasswordTwo("");
          }, 5000);
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      setPassword("");
      setPasswordTwo("");
      console.log("Passwords are not the same");
    }
  };

  const handleReactivateAccount = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${URL}/user/reactivate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "Application/json",
          "api-key": APIKEY,
        },
        credentials: "include",
        body: JSON.stringify({ email: emailOrUsername }),
      });
      const data = await response.json();

      if (response.status !== 200) {
        console.log(data.message);
      } else {
        console.log(data.message);
        setWaitingForVerification(true);
        setTimeout(() => {
          setWaitingForVerification(false);
          setReactivate(false);
          setSignUp(false);
        }, 5000);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const gotToSignUp = (e) => {
    e.preventDefault();
    setSignUp(!signUp);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-1 bg-[var(--background-second)] text-(--text-color) text-(length:--font-size-standard) font-(family-name:--standard-font) px-6 py-2 max-w-[550px] w-full mx-auto m-2 rounded-lg shadow-[1px_1px_8px_var(--shadow-color)] ">
      {!isLoggedIn && waitingForVerification && (
        <h2 className="text-(length:--font-size-largerStandard) font-bold">
          Please check your postbox and click on the link to verify your email.{" "}
        </h2>
      )}
      {!isLoggedIn && !signUp && !waitingForVerification && newPasswordTrue && (
        <>
          <h2 className="text-(length:--font-size-largerStandard) font-bold">
            Neues Passwort
          </h2>
          <form
            onSubmit={handleNewPassword}
            className="flex flex-col gap-2 w-full pb-8 border-b"
          >
            <p>Email:</p>
            <input
              className="px-4 py-2 border border-[var(--text-color)] rounded-lg  bg-[var(--input-primary)] text-(--text-color) w-[100%] mx-auto "
              type="text"
              onChange={(e) => {
                e.preventDefault();
                setEmailOrUsername(e.target.value);
              }}
              required
            ></input>
            <p>neues Passwort:</p>
            <input
              className="px-4 py-2 border border-[var(--text-color)] rounded-lg  bg-[var(--input-primary)] text-(--text-color) w-[100%] mx-auto "
              type="password"
              minLength="8"
              maxLength="20"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}"
              title="Password must be at least 8 characters, include at least one number, one uppercase letter, and one special character."
              value={password}
              onChange={(e) => {
                e.preventDefault();
                setPassword(e.target.value);
              }}
              required
            ></input>
            <p>Passwort wiederholen:</p>
            <input
              className="px-4 py-2 border border-[var(--text-color)] rounded-lg  bg-[var(--input-primary)] text-(--text-color) w-[100%] mx-auto "
              type="password"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}"
              title="Password must be at least 8 characters, include at least one number, one uppercase letter, and one special character."
              value={passwordTwo}
              onChange={(e) => {
                e.preventDefault();
                setPasswordTwo(e.target.value);
              }}
              required
            ></input>
            <button
              className="cursor-pointer mt-4 px-6 py-2 rounded-md bg-[var(--primary-color-100)] text-(--text-color-rev) w-[60%] mx-auto"
              type="submit"
            >
              abschicken
            </button>
          </form>
          <div
            className="text-center text-(--link-color) mb-4  px-4 py-1 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setNewPasswordTrue(false);
              setPassword("");
            }}
          >
            zurück
          </div>
        </>
      )}

      {!isLoggedIn &&
        !signUp &&
        !waitingForVerification &&
        !newPasswordTrue &&
        !reactivate && (
          <>
            <h2 className="text-(length:--font-size-largerStandard) font-bold">
              Anmelden
            </h2>
            <form
              onSubmit={handleLogIn}
              className="flex flex-col gap-2 w-full border-b text-(length:--font-size-standard)"
            >
              {" "}
              <p>Email oder Benutzername:</p>
              <input
                className="px-4 py-2 border border-[var(--text-color)] rounded-lg  bg-[var(--input-primary)] text-(--text-color) w-[100%] mx-auto "
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  setEmailOrUsername(e.target.value);
                }}
                required
              ></input>
              <p>Passwort: </p>
              <input
                className="px-4 py-2 border border-[var(--text-color)]  rounded-lg bg-[var(--input-primary)] text-(--text-color) w-[100%] mx-auto "
                type="password"
                onChange={(e) => {
                  e.preventDefault();
                  setPassword(e.target.value);
                }}
                required
              ></input>
              <a
                className=" text-(--link-color) cursor-pointer w-fit"
                onClick={(e) => {
                  e.preventDefault();
                  setNewPasswordTrue(true);
                  setPassword("");
                }}
              >
                Passwort vergessen?
              </a>
              <button
                className="cursor-pointer mt-3 px-6 py-2 rounded-md bg-[var(--primary-color-100)] text-(--text-color-rev) w-[70%] mx-auto"
                type="submit"
              >
                Anmelden
              </button>
              <div className="text-center mb-4">
                Sie haben noch keinen Account?{"  "}
                <a
                  className="text-(--link-color) cursor-pointer"
                  onClick={gotToSignUp}
                >
                  hier registrieren.
                </a>
              </div>
            </form>

            <div className="flex flex-col items-center justify-center w-[100%]  mb-4 border-b">
              <h2 className="text-(length:--font-size-largerStandard) font-bold">
                oder
              </h2>
              <button
                onClick={googleLogin}
                className="flex items-center justify-center  cursor-pointer my-4 mb-8 px-4 py-2  rounded-md bg-[var(--primary-color-100)] text-(--text-color-rev) w-[70%] mx-auto  "
              >
                <FcGoogle className="text-(length:--font-size-largerStandard)" />
                <p className="w-fit pl-2 "> Mit Google anmelden</p>
              </button>
            </div>
            <div className="mb-4">
              Account gelöscht? wollen Sie ihn wieder{" "}
              <a
                className=" text-(--link-color) cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setReactivate(true);
                }}
              >
                aktivieren ?
              </a>
            </div>
          </>
        )}
      {!isLoggedIn &&
        signUp &&
        !waitingForVerification &&
        !newPasswordTrue &&
        !reactivate && (
          <>
            <h2 className="text-(length:--font-size-largerStandard) font-bold">
              Registrieren
            </h2>
            <form
              onSubmit={handleSignUp}
              className="flex flex-col gap-2 w-full border-b"
            >
              <p>Benutzername:</p>
              <input
                className="px-4 py-2 border border-[var(--text-color)] rounded-lg  bg-[var(--input-primary)] text-(--text-color) w-[100%] mx-auto "
                type="text"
                value={userData?.userName}
                onChange={(e) => {
                  e.preventDefault();
                  setUserdata({
                    ...userData,
                    userName: e.target.value,
                  });
                }}
                required
              ></input>
              <p>Email:</p>
              <input
                className="px-4 py-2 border border-[var(--text-color)] rounded-lg  bg-[var(--input-primary)] text-(--text-color) w-[100%] mx-auto "
                type="email"
                value={userData?.email}
                onChange={(e) => {
                  e.preventDefault();
                  setUserdata({
                    ...userData,
                    email: e.target.value,
                  });
                }}
                required
              ></input>
              <p>Passwort:</p>
              <input
                className="px-4 py-2 border border-[var(--text-color)] rounded-lg  bg-[var(--input-primary)] text-(--text-color) w-[100%] mx-auto "
                type="password"
                minLength="8"
                maxLength="20"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}"
                title="Password must be at least 8 characters, include at least one number, one uppercase letter, and one special character."
                value={userData?.password}
                onChange={(e) => {
                  e.preventDefault();
                  setUserdata({
                    ...userData,
                    password: e.target.value,
                  });
                }}
                required
              ></input>
              <p>Passwort wiederholen:</p>
              <input
                className="px-4 py-2 border border-[var(--text-color)] rounded-lg  bg-[var(--input-primary)] text-(--text-color) w-[100%] mx-auto "
                type="password"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}"
                title="Password must be at least 8 characters, include at least one number, one uppercase letter, and one special character."
                value={passwordTwo}
                onChange={(e) => {
                  e.preventDefault();
                  setPasswordTwo(e.target.value);
                }}
                required
              ></input>

              <button
                className="cursor-pointer mt-4 px-6 py-2 rounded-md bg-[var(--primary-color-100)] text-(--text-color-rev) w-[70%] mx-auto"
                type="submit"
              >
                registrieren
              </button>
              <div className="text-center mb-4">
                Sie haben schon einen Account?{"  "}
                <a
                  className="text-(--link-color) cursor-pointer"
                  onClick={gotToSignUp}
                >
                  Login.
                </a>
              </div>
            </form>

            <div className="flex flex-col items-center justify-center w-[100%]  mb-4 border-b">
              <h2 className="text-(length:--font-size-largerStandard) font-bold">
                oder
              </h2>
              <button
                onClick={googleLogin}
                className="flex items-center justify-center  cursor-pointer my-4 mb-8 px-4 py-2  rounded-md bg-[var(--primary-color-100)] text-(--text-color-rev) w-[70%] mx-auto  "
              >
                <FcGoogle className="text-(length:--font-size-largerStandard)" />
                <p className="w-fit pl-2"> Mit Google registrieren</p>
              </button>
            </div>
          </>
        )}

      {!isLoggedIn &&
        !signUp &&
        !waitingForVerification &&
        !newPasswordTrue &&
        reactivate && (
          <>
            <h2 className="text-(length:--font-size-largerStandard) font-bold">
              Account reaktivieren
            </h2>
            <form
              onSubmit={handleReactivateAccount}
              className="flex flex-col gap-4 w-full pb-8 border-b"
            >
              <p>Email:</p>
              <input
                className="px-4 py-2 border border-[var(--text-color)] rounded-lg  bg-[var(--input-primary)] text-(--text-color) w-[100%] mx-auto "
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  setEmailOrUsername(e.target.value);
                }}
                required
              ></input>

              <button
                className="cursor-pointer mt-4 px-6 py-2 rounded-md bg-[var(--primary-color-100)] text-(--text-color-rev) w-[60%] mx-auto"
                type="submit"
              >
                Account reaktivieren
              </button>
            </form>
            <div
              className="text-center text-(--link-color) mb-4 px-4 py-1 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setReactivate(false);
              }}
            >
              zurück
            </div>
          </>
        )}
    </div>
  );
};

export default LogInReg;

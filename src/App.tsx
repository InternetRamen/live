import React, { useEffect, useState } from "react";

import "./App.css";
import Gather from "./components/Gather";
import Resend from "./components/Resend";

import { initializeApp } from "firebase/app";
import {
    getAuth,
    isSignInWithEmailLink,
    signInWithEmailLink,
    onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {getFirestore, doc, setDoc, getDoc} from "firebase/firestore";
// Confirm the link is a sign-in with email link.

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = require("./firebase.json");

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
function App() {
    let [email, setEmail] = useState("");
    let [sent, setSent] = useState(false);
    let navigate = useNavigate();
    useEffect(() => {
        const auth = getAuth();
        if (isSignInWithEmailLink(auth, window.location.href)) {
            let x = window.localStorage.getItem("emailForSignIn");
            if (!x) return;

            setEmail(x);
            signInWithEmailLink(auth, email, window.location.href)
                .then(async (result) => {
                    // Clear email from storage.
                    window.localStorage.removeItem("emailForSignIn");
                    // You can access the new user via result.user
                    // Additional user info profile not available via:
                    // result.additionalUserInfo.profile == null
                    // You can check if the user is new or existing:
                    // result.additionalUserInfo.isNewUser
                    let query = await getDoc(doc(db, "users", result.user.uid))
                    if (!query.exists()) {
                        await setDoc(doc(db, "users", result.user.uid), {
                        name: "",
                        code: "",
                        email: result.user.email,
                        school: "",
                        grade: "",
                        status: {
                            confirmation: false,
                            contact: false,
                            documents: false
                        }
                    })
                    } else {
                        console.log("Already Existed")
                    }
                    navigate("./dashboard", { replace: true });
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
              onAuthStateChanged(auth, (user) => {
                  if (user) {
                      // User is signed in, see docs for a list of available properties
                      // https://firebase.google.com/docs/reference/js/firebase.User
                      navigate("./dashboard", {replace: true})
                      // ...
                  }
              });
        }
    }, [email, navigate]);

    return (
        <div className="App">
            <div className="overflow-hidden">
                <div className="background flex flex-col align-center justify-center fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                    <p className="bg">POOLESVILLE</p>
                    <p className="bg">POOLESVILLE</p>
                    <p className="bg">POOLESVILLE</p>
                    <p className="bg">POOLESVILLE</p>
                    <p className="bg">POOLESVILLE</p>
                </div>
                <div className="box fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-base-blue w-[50%] h-[400px] border-2 flex flex-col items-center py-5 px-20 ">
                    <h1 className="text-white font-bold text-3xl ">
                        poolesville_hacks
                    </h1>
                    {!sent ? (
                        <Gather
                            email={email}
                            setEmail={setEmail}
                            setSent={setSent}
                        />
                    ) : (
                        <Resend email={email} />
                    )}
                </div>
            </div>
            ) : (<div></div>)
        </div>
    );
}

export default App;

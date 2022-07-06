import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: "https://live.poolesvillehacks.tech",
    // This must be true.
    handleCodeInApp: true,

};
const sendLoginLink = (email: string) => {
    const auth = getAuth();
    sendSignInLinkToEmail(auth, email, actionCodeSettings)
        .then(() => {
            console.log("sent")
            window.localStorage.setItem("emailForSignIn", email);
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        });
};

export default sendLoginLink;

//firebase, link
import { connect } from 'react-redux';
import { changeMode } from '../../redux/mode/mode.actions';
import styles from './sidebar.module.scss'

import top from './sidebarTop.png';
import sidebarTop from './SidebarTop.svg';

import sun from './sun.svg';
import moon from './moon.svg';
// import user from './userpng.png'

import { getAuth, signInWithPopup, GithubAuthProvider, onAuthStateChanged } from "firebase/auth";



import { ReactComponent as User } from './user.svg';
import { useEffect, useState } from 'react';
import { auth, provider } from '../../firebase/firebase.utils';


const Sidebar = ({ changeMode, mode }) => {

    const [signed, setSigned] = useState(null)

    const signIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a GitHub Access Token. You can use it to access the GitHub API.
                const credential = GithubAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;

                // The signed-in user info.
                const user = result.user;
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GithubAuthProvider.credentialFromError(error);
                // ...

                console.log(errorCode, errorMessage)
            });
    }

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              const uid = user.uid;
              // ...
              setSigned(user)
            } else {
              // User is signed out
              // ...
              setSigned(null)
            }
          });
    }, [])

    return ( 
    <div className={styles.body}>
        <img src={sidebarTop} className={styles.top} alt="" />
        <div className={styles.bottom}>
            <div className={styles.bottom_first}>
                <img src={mode.light ? moon : sun} onClick={()=>changeMode()} alt="icon for switching light or dark mode" />
            </div>
            <div className={styles.bottom_second}>
                {
                    signed ?
                    <div className="" onClick={()=>auth.signOut()}>Sign Out!</div>
                    :
                    <div className={styles.user} onClick={()=>signIn()}>Sign In With GitHub!</div>
                }
            </div>
        </div>
    </div> );
}

const mapStateToProps = state => ({
    mode: state.mode,
    data: state.data
})
  
const mapDispatchToProps = dispatch => ({
    changeMode: () => dispatch(changeMode()),
})
  
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
import { connect } from 'react-redux';
import { changeMode } from '../../redux/mode/mode.actions';
import styles from './sidebar.module.scss'

import sidebarTop from './SidebarTop.svg';

import sun from './sun.svg';
import moon from './moon.svg';
// import user from './userpng.png'

import { signInWithPopup, onAuthStateChanged } from "firebase/auth";



import { useEffect, useState } from 'react';
import { auth, provider } from '../../firebase/firebase.utils';


const Sidebar = ({ changeMode, mode }) => {

    const [signed, setSigned] = useState(null)

    const signIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log(result)
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.log(errorCode, errorMessage)
            });
    }

    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {

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
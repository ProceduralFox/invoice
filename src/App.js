
import './App.scss';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { changeMode, toggleForm } from './redux/mode/mode.actions';
import { collection, getDocs } from "firebase/firestore"; 
import { db } from './firebase/firebase.utils';
import { setData } from './redux/data/data.actions';
import { Route, Switch } from 'react-router';
import ViewPage from './pages/view.page';
import MainPage from './pages/main.page';
import Sidebar from './components/sidebar/sidebar.component';




function App({ mode, changeMode, data, setData, toggleForm }) {  

  const [loaded, setLoaded] = useState(false)




  useEffect(()=>{
    async function getInvoices (){
      const temp = {}
      const querySnapshot = await getDocs(collection(db, "invoices"));
          querySnapshot.forEach((doc) => {
              temp[doc.id] = doc.data()
            });
      setData(temp)
      setLoaded(true)
    }

    getInvoices()

  }, [setData])



  if(loaded){
    return (
      <div className={`App ${mode.light ? 'light' : 'dark'}`}>
        <Sidebar></Sidebar>  
        <Switch>
          <Route exact path='/' component={MainPage}></Route>
          <Route path ='/id/:id' component={ViewPage}></Route>
        </Switch>
      </div>
    );
  } else {
    return (
      null
    )
  }
}

const mapStateToProps = state => ({
  mode: state.mode,
  data: state.data
})

const mapDispatchToProps = dispatch => ({
  changeMode: () => dispatch(changeMode()),
  setData: (data) => dispatch(setData(data)),
  toggleForm: () => dispatch(toggleForm())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);

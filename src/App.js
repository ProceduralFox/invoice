import logo from './logo.svg';
import './App.scss';
import InvoicesList from './components/invoices_list/invoices_list.component';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react';
import { changeMode, toggleForm } from './redux/mode/mode.actions';
import { collection, doc, getDocs, addDoc, setDoc } from "firebase/firestore"; 
import { db } from './firebase/firebase.utils';
import { setData } from './redux/data/data.actions';
import InvoiceView from './components/invoice_view/invoice_view.component';
import InvoiceForm from './components/form/form.component';
import Replication from './components/form/form_text';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import ViewPage from './pages/view.page';
import MainPage from './pages/main.page';
import Sidebar from './components/sidebar/sidebar.component';




function App({ mode, changeMode, data, setData, toggleForm }) {  

  const [loaded, setLoaded] = useState(false)

  async function getInvoices (){
    const temp = {}
    const querySnapshot = await getDocs(collection(db, "invoices"));
        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data().status}`);
            temp[doc.id] = doc.data()
          });
    setData(temp)
    setLoaded(true)
  }


  useEffect(()=>{
    getInvoices()

  }, [])



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

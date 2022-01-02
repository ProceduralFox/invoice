import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setData } from "../../redux/data/data.actions";
import { changeMode, toggleForm } from "../../redux/mode/mode.actions";
import InvoicesItem from "../invoices_list_item/invoices_item.component";

import styles from "./invoice_list.module.scss";

import Checkbox from './checkbox.svg';
import Buttonplus from './buttonplus.svg';
import { auth } from "../../firebase/firebase.utils";


const InvoicesList = ({ mode, data, changeMode, toggleForm }) => {

    const [sortBy, setSortBy] = useState(false)
    const [sorting, setSorting] = useState( new Array(3).fill(false))
    const [category, setCategory] = useState(["draft", "paid", "pending"])
    const [toggled, setToggled] = useState(false)
    const [onlyOwn, setOnlyOwn] = useState(false)
    const [screen, setScreen] = useState(window.innerWidth)

    useEffect(()=>{
        function handle_resize(){
            setScreen(window.innerWidth)
            
        }

        window.addEventListener('resize', handle_resize)

        return () => {
            window.removeEventListener('resize', handle_resize)
        }
    }, [])

    function handleSort(index){
        const newSorting = new Array(3).fill(false)

        if(sorting[index] === true) {
            setSorting(newSorting)
            setSortBy(false)
            return
        }

        newSorting[index] = true

        setSortBy(category[index])
        setSorting(newSorting)
    }

    return ( 
    <div className={styles.body}>
        <div className={styles.top}>
            <div className={`${mode.light ? styles.light : styles.dark}`}>
                <h2 className="h1">Invoices</h2>
                {
                    screen > 690 ?
                    <p className="body_1">There are {Object.keys(data).length} total invoices</p>
                    :
                    <p className="body_1">{Object.keys(data).length} invoices</p>
                }
            </div>

            <div className={`${mode.light ? styles.light : styles.dark}`}>
                {
                    screen > 690 ?
                    <h2 className={`${toggled ? styles.filter_up : styles.filter} ${styles.pointer}`} onClick={()=>setToggled(!toggled)} tabIndex="0">Filter by status</h2>
                    :
                    <h2 className={`${toggled ? styles.filter_up : styles.filter} ${styles.pointer}`} onClick={()=>setToggled(!toggled)} tabIndex="0">Filter</h2>
                }
                <div className={`${toggled ? styles.popup__visible : styles.popup__hidden} ${styles.popup}`}>
                    <ul className={styles.popup__inner}>
                        {
                            category.map((element, index)=>{
                                return (
                                    <li key={index} className={`${mode.light ? styles.light : styles.dark}`}>
                                        <input className={`${styles.checkbox} ${styles.pointer}`} type="checkbox" id={`sorting_${index}`} value={element} checked={sorting[index]} onChange={()=>handleSort(index)} />
                                        <label className={`h3_2 ${styles.pointer}`} htmlFor={`sorting_${index}`}>{element}</label>
                                    </li>
                                )
                            })
                        }

                       <li key={"own"} className={`${mode.light ? styles.light : styles.dark}`}>
                            <input className={`${styles.checkbox} ${styles.pointer}`} type="checkbox" id="own" value={"test"} checked={onlyOwn} onChange={()=>setOnlyOwn(!onlyOwn)} />
                            <label className={`h3_2 ${styles.pointer}`} htmlFor={"own"}>Show only my invoices</label>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="">
                <button onClick={()=>{toggleForm()}} className={`btn_2 ${styles.pointer} ${styles.add}`}> <img src={Buttonplus} alt="" />
                {
                    screen > 690 ?
                    <h3 className="h3_2">New Invoice</h3>
                    :
                    <h3 className="h3_2">New</h3>
                }
                </button>
            </div>
        </div>
        <div className={styles.main}>
            {
                data ?
                Object.keys(data).map((element, index)=>{

                    if(!sortBy){

                        if(!onlyOwn || !auth.currentUser){
                            return (
                                <InvoicesItem invoice={data[element]} mode={mode} key={data[element].id}></InvoicesItem>)
                        } else {
                            if(data[element].uid === auth.currentUser.uid){
                                return (
                                    <InvoicesItem invoice={data[element]} mode={mode} key={data[element].id}></InvoicesItem>
                                )
                            }
                        }

                    }

                    if(data[element].status === sortBy){
                        if(!onlyOwn || !auth.currentUser){
                            return (
                                <InvoicesItem invoice={data[element]} mode={mode} key={data[element].id}></InvoicesItem>)
                        } else {
                            if(data[element].uid === auth.currentUser.uid){
                                return (
                                    <InvoicesItem invoice={data[element]} mode={mode} key={data[element].id}></InvoicesItem>
                                )
                            }
                        }                  
                    }

                    return

                })
                :
                <div className="loading">THERE IS NOTHING HERE</div>
            }
        </div>
    </div>  
    );
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(InvoicesList);
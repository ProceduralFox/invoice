import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import { db } from "../../firebase/firebase.utils";
import { setData } from "../../redux/data/data.actions";
import { changeMode, toggleForm } from "../../redux/mode/mode.actions";

import styles from "./invoice_view.module.scss"

import { doc, deleteDoc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";


const InvoiceView = ({ mode, data, changeMode, setData, invoice, slug, toggleForm }) => {

    const [ID, setId] = useState(slug)
    const [loaded, setLoaded] = useState(false)
    const [history, setHistory] = useState(useHistory())
    const [screen, setScreen] = useState(window.innerWidth)

    useEffect(()=>{
        function handle_resize(){
            setScreen(window.innerWidth)
            console.log(window.innerWidth)
            
        }

        window.addEventListener('resize', handle_resize)

        return () => {
            window.removeEventListener('resize', handle_resize)
        }
    }, [])

    const removeID = async () => {
        const tempDATA = {...data}

        delete tempDATA[ID]
        try { 
            await deleteDoc(doc(db, "invoices", ID));
            history.push("/")
            setData(tempDATA)
        } catch (error) {
            window.alert("You are either not logged in or attempting to delete an invoice which you have not created!")
        }
    }

    const markPaid = async () => {
        const tempData = {...data}
        tempData[ID].status = "paid"

        await setDoc(doc(db, "invoices", ID), tempData[ID]);

        setData(tempData)
    }

    // if(true){
    //     return (
    //         <div className="XD">Hello</div>
    //     )
    // }

    return (
        <div className="page">
        <div className={styles.body}>
            <div className={`${styles.back} ${mode.light ? styles.back_light : styles.back_dark}`}>
                <h2 className={`h3_2`} tabindex={0} onClick={()=>{history.push("/")}}>Go back</h2>
            </div>
            <div className={`${styles.top} ${mode.light ? styles.light : styles.dark}`}>

                <div className="">
                    <h2>Status</h2>
                    <h1 className="body_2">{data[ID].status}</h1>
                </div>

                {
                        screen > 690 ?
                        <div className={`${mode.light ? styles.light : styles.dark} ${styles.top_buttons}`}>
                            <button onClick={()=>{toggleForm()}} className={styles.edit}><h3 className="h3_2">Edit</h3></button>
                            <button onClick={()=>{removeID()}} className={styles.delete}><h3 className="h3_2">Delete</h3></button>
                            <button onClick={()=>{markPaid()}}className={`btn_2`}><h3 className="h3_2">Mark as Paid</h3></button>
                        </div> 
                        :
                        null
                }
            </div>
            <div className={`${styles.main} ${mode.light ? styles.light : styles.dark}`}>
                <div className={`${styles.first}`}>
                    <div className={`${mode.light ? styles.light : styles.dark}`}>
                        <h2 className="h3">{data[ID].id}</h2>
                        <p className="body_1">{data[ID].description}</p>
                    </div>
                    <div className={`${mode.light ? styles.light : styles.dark}`}>
                        <p className="body_2">{data[ID].senderAddress.street}</p>
                        <p className="body_2">{data[ID].senderAddress.city}</p>
                        <p className="body_2">{data[ID].senderAddress.postCode}</p>
                        <p className="body_2">{data[ID].senderAddress.country}</p>
                    </div>
                </div>

                <div className={`${styles.second} ${mode.light ? styles.light : styles.dark}`}>

                        <div className={`${mode.light ? styles.light : styles.dark}`}>
                            <p className="body_1">Invoice date</p>
                            <h2 className="h3_3">{data[ID].createdAt}</h2>
                        </div>
                        <div className={`${mode.light ? styles.light : styles.dark}`}>
                            <p className="body_1">Payment due</p>
                            <h2 className="h3_3">{data[ID].paymentDue}</h2>
                        </div>

                    <div className={`${mode.light ? styles.light : styles.dark}`}>
                        <p className="body_1">Bill to</p>
                        <h2 className="h3_3">{data[ID].clientName}</h2>
                        <p className="body_2">{data[ID].clientAddress.street}</p>
                        <p className="body_2">{data[ID].clientAddress.city}</p>
                        <p className="body_2">{data[ID].clientAddress.postCode}</p>
                        <p className="body_2">{data[ID].clientAddress.country}</p>
                    </div>

                    <div className="">
                        <p className="body_1">sent to</p>
                        <h2 className="h3_3">{data[ID].clientEmail}</h2>
                    </div>
                </div>

                <div className={`${styles.sum} ${mode.light ? styles.light : styles.dark}`}>
                        {
                            screen > 691 ?
                            <div className={`${styles.sum__upper}`}>
                                <div className="">
                                    <div className={`${mode.light ? styles.light : styles.dark}`}>
                                        <p className="body_2">Item Name</p>
                                        <p className="body_2">QTY</p>
                                        <p className="body_2">Price</p>
                                        <p className="body_2">Total</p>
                                    </div>

                                    {
                                        data[ID].items.map((item, key)=>{
                                            return (
                                            <div key={item.id} className={`${mode.light ? styles.light : styles.dark}`}>
                                                <h2 className="h3_2">{item.name}</h2>
                                                <p className="h3_2">{item.quantity}</p>
                                                <p className="h3_2">{item.price}</p>
                                                <h2 className="h3_2">{item.total}</h2>
                                            </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            :
                            <div className={styles.sum__upper}>
                                <div className="">
                                {
                                    data[ID].items.map((item, index)=>{
                                        return (
                                            <div key={item.id} className={`${mode.light ? styles.light : styles.dark}`}>
                                                <h2 className="h3_2">{item.name}</h2>
                                                <p className="h3_2">{item.quantity} x &pound; {item.price}</p>
                                                <h2 className="h3_2">{item.total}</h2>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            </div>
                        }
                        <div className={styles.sum__lower}>
                            <div className={styles.white}>
                                <h2 className="body_2 white">Amount Due</h2>
                                <h2 className="h2_2 white">£ {data[ID].total}</h2>
                            </div> 
                        </div>
                </div>
            </div>
            {
                screen < 691 ?
                <div className={`${mode.light ? styles.light : styles.dark} ${styles.mobile_buttons}`}>
                    <button onClick={()=>{toggleForm()}} className={styles.edit}><h3 className="h3_2">Edit</h3></button>
                    <button onClick={()=>{removeID()}} className={styles.delete}><h3 className="h3_2">Delete</h3></button>
                    <button onClick={()=>{markPaid()}}className={`btn_2`}><h3 className="h3_2">Mark as Paid</h3></button>
                </div>
                :
                <div className="">{null}</div>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(InvoiceView);
import { useState } from 'react';
import { connect } from 'react-redux';
import { editData, setData } from '../../redux/data/data.actions';
import { changeMode, toggleForm } from '../../redux/mode/mode.actions';
import styles from './form.module.scss'

import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase.utils";

import bin from './deleteItem.svg';


const InvoiceForm = ({ mode, data, experiment, edit, toggleForm, editData }) => {
    const invoiceConditional = (edit)=>{
        if(edit){
            if(data[edit]){
                return data[edit]
            }
        }
        return {
            clientAddress: {
                city: "",
                country: "",
                postCode: "",
                street: ""
            },
            clientEmail: "",
            clientName: "",
            createdAt: "",
            description: "",
            id: generateID(),
            items: [
                {
                    name: "",
                    price: 0,
                    quantity: 0,
                    total: 0
                }
            ],
            paymentDue: "",
            paymentTerms: 0,
            senderAddress: {
                city:"",
                country: "",
                postCode: "",
                street: ""
            },
            status: "",
            total: 0,
            uid: ""
        }
    }

    const itemsConditional = (edit) => {
        if(edit){
            if(data[edit]){
                return data[edit].items
            }
        }
        return [{
            name: "New Item",
            price: 0,
            quantity: 0,
            total: 0
        }]
    }

    const changeItems = (index, type, value, add=false) => {
        if(add){
            const temp_items = [...items]
            temp_items.push({
                name: "New Item",
                price: 0,
                quantity: 0,
                total: 0
            })

            setItems(temp_items)

            return
        }
        
        const temp_items = [...items]
        
        temp_items[index][type] = value

        if (type==="price" || type==="quantity") {
            temp_items[index].total = temp_items[index].price * temp_items[index].quantity
        }

        setItems(temp_items)
    }

    const deleteItem = (index) => {
        const temp_items = []

        for (let i = 0; i < items.length; i++) {
            if(i===index){
                continue
            }

            temp_items.push(items[i])
            
        }

        setItems(temp_items)
    }

    const submit = async (draft) => {
        let valid = null
        let status = null

        if(draft){
            valid = true
            status = "draft"
        } else {
            valid = validate()
            status = "pending"
        }

        const paymentDue = new Date(invoice.createdAt)
        const createdAt = new Date(invoice.createdAt)

        const daysAdd = parseInt(payment.substring(4, 6), 10)
        paymentDue.setDate(paymentDue.getDate() + daysAdd)
        let tempTotal = 0

        items.forEach(item => {
            tempTotal += item.total
        });

        const tempInvoice = {...invoice, status: status, items: items, paymentDue: paymentDue.toString().substring(4, 15), createdAt: createdAt.toString().substring(4, 15), total: tempTotal.toFixed(2)}

        if(invoice.uid){
            // invoice is being EDITED cause uid is not an empty string, so nothing needs to happen as if the wrong user is editing it still won't go through due to back end security
            
        } else {
         // invoice is being CREATED cause uid is not an empty string
            if(auth.currentUser){
                const tempUid = auth.currentUser.uid

                tempInvoice.uid = tempUid
                console.log("tempInvoice is", tempInvoice)
            } else {
                console.log("You are trying to write a new invoice even though you are not signed in. Please sign in using Github in the bottom left corner")
            }
        }

        if(valid){
            try {
                await setDoc(doc(db, "invoices", invoice.id), tempInvoice);
                editData(tempInvoice)
                toggleForm()
            } catch (error) {
                window.alert("You are either not logged in or attempting to edit or delete an invoice which you did not create!")
            }

        } else {
            console.log("don't write data")
        }
    }

    const validate = () => {
        const temp_errors = {...errors}
        const array_errors = Object.keys(temp_errors)
        let valid = true

        for (let index = 0; index < array_errors.length; index++) {
            const error = array_errors[index]

            if(typeof invoice[error] === "object"){
                const array_object = Object.keys(temp_errors[error])

                for (let index = 0; index < array_object.length; index++){
                    if(!invoice[error][array_object[index]]){
                        temp_errors[error][array_object[index]] = "Fill out the field pls"
                        valid = false
                    } else {
                        temp_errors[error][array_object[index]] = ""
                    }
                }

                continue
            }
            
            if(!invoice[error]){
                temp_errors[error] = "Fill out the field pls"
                valid = false
                continue
            } else {
                temp_errors[error] = ""
            }
        } 

        setErrors(temp_errors)

        return valid
    }

    const generateID = () => {
        let id = ""

        for (let index = 0; index < 2; index++) {
            const code = Math.floor(Math.random() * (91 - 65) + 65);
            const char = String.fromCharCode(code);

            id = id + char
            
        }

        for (let index = 0; index < 4; index++) {
            const code = Math.floor(Math.random() * (58 - 48) + 48);
            const char = String.fromCharCode(code);

            id = id + char
            
        }

        if(data.hasOwnProperty(id)){
            return generateID()
        }

        return id
    }

    const [invoice, setInvoice] = useState(invoiceConditional(edit))
    const [items, setItems] = useState(itemsConditional(edit))
    const [errors, setErrors] = useState({
    clientAddress: {
        city: "",
        country: "",
        postCode: "",
        street: ""
    },
    clientEmail: "",
    clientName: "",
    description: "",
    senderAddress: {
        city:"",
        country: "",
        postCode: "",
        street: ""
    }
    })
    const [payment, setPayment] = useState("Net 30 Days")


    if(mode.form){
    return ( 
        <div className={`${mode.form ? styles.body : styles.body__hidden}`} onClick={(e)=>{const target = e.currentTarget; console.log(target, e.target)}}>
            <form action="" onSubmit={(e)=>e.preventDefault()}>
            <div className={`${mode.light ? styles.light : styles.dark} ${styles.main}`}>
                <div className={`${mode.light ? styles.light : styles.dark} ${styles.title}`}>
                    <div className="h1">{edit ? <h1 className="h2_2">Edit<span>#</span>{edit}</h1> : <h2 className="h2_2">New Invoice</h2>}</div>
                </div>

                <div className={`${mode.light ? styles.light : styles.dark} ${styles.inner}`}>
                    <div className={`${styles.purple} h3_2`}>Bill From</div>

                    <div className={`${mode.light ? styles.light : styles.dark}`}>
                        <label htmlFor="street_our">Street Address</label> <label className={styles.error} htmlFor="street_our">{errors.senderAddress.street}</label>
                        <input className={`${styles.form_element} ${styles.long}`} type="text" id="street_our" value={invoice.senderAddress.street} onChange={(e)=>setInvoice({...invoice, senderAddress: {...invoice.senderAddress, street: e.target.value} })}></input>
                    </div>

                    <div className={`${mode.light ? styles.light : styles.dark}`}>
                        <div className={`${mode.light ? styles.light : styles.dark}`}>
                            <div className={`${mode.light ? styles.light : styles.dark}`}>
                                <div className={`${mode.light ? styles.light : styles.dark}`}>
                                    <label htmlFor="city_our">City</label> <label className={styles.error} htmlFor="street_our">{errors.senderAddress.city}</label>
                                </div>
                                <input className={`${styles.form_element} ${styles.short}`} type="text" id="city_our" value={invoice.senderAddress.city} onChange={(e)=>{setInvoice({...invoice, senderAddress:{...invoice.senderAddress, city: e.target.value}})}}></input>
                            </div>

                            <div className={`${mode.light ? styles.light : styles.dark}`}>
                                <div className={`${mode.light ? styles.light : styles.dark}`}>
                                    <label htmlFor="post_our">Post Code</label> <label className={styles.error} htmlFor="post_our">{errors.senderAddress.postCode}</label>
                                </div>
                                <input className={`${styles.form_element} ${styles.short}`} type="text" id="post_our" value={invoice.senderAddress.postCode} onChange={(e)=>{setInvoice({...invoice, senderAddress:{...invoice.senderAddress, postCode: e.target.value}})}}></input>
                            </div>

                            <div className={`${mode.light ? styles.light : styles.dark}`}>
                                <div className={`${mode.light ? styles.light : styles.dark}`}>
                                    <label htmlFor="country_our">Country</label> <label className={styles.error} htmlFor="country_our">{errors.senderAddress.country}</label>
                                </div>
                                <input className={`${styles.form_element} ${styles.short}`} type="text" id="country_our" value={invoice.senderAddress.country} onChange={(e)=>{setInvoice({...invoice, senderAddress:{...invoice.senderAddress, country: e.target.value}})}}></input>
                            </div>
                        </div>
                    </div>

                    <div className={`${mode.light ? styles.light : styles.dark} ${styles.purple} h3_2`}>Bill to</div>

                    <div className={`${mode.light ? styles.light : styles.dark}`}>
                        <div className={`${mode.light ? styles.light : styles.dark}`}>
                            <label htmlFor="name">Client's Name</label> <label className={styles.error} htmlFor="name">{errors.clientName}</label>
                        </div>
                        <input className={`${styles.form_element} ${styles.long}`} type="text" id="name" value={invoice.clientName} onChange={(e)=>{setInvoice({...invoice, clientName: e.target.value})}}></input>
                    </div>

                    <div className={`${mode.light ? styles.light : styles.dark}`}>
                        <div className={`${mode.light ? styles.light : styles.dark}`}>
                            <label htmlFor="email">Client's Email</label> <label className={styles.error} htmlFor="email">{errors.clientEmail}</label>
                        </div>
                        <input className={`${styles.form_element} ${styles.long}`} type="text" id="email" value={invoice.clientEmail} onChange={(e)=>{setInvoice({...invoice, clientEmail: e.target.value})}}></input>
                    </div>

                    <div className={`${mode.light ? styles.light : styles.dark}`}>
                        <div className={`${mode.light ? styles.light : styles.dark}`}>
                            <label htmlFor="street">Street Address</label> <label className={styles.error} htmlFor="street">{errors.clientAddress.street}</label>
                        </div>
                        <input className={`${styles.form_element} ${styles.long}`} type="text" id="street" value={invoice.clientAddress.street} onChange={(e)=>{setInvoice({...invoice, clientAddress: {...invoice.clientAddress, street: e.target.value}})}}></input>
                    </div>

                    <div className={`${mode.light ? styles.light : styles.dark}`}>
                        <div className={`mode.light ? styles.light : styles.dark`}>
                                <div className={`${mode.light ? styles.light : styles.dark}`}>
                                    <div className={`${mode.light ? styles.light : styles.dark}`}>
                                        <label htmlFor="city">City</label> <label className={styles.error} htmlFor="city">{errors.clientAddress.city}</label>
                                    </div>
                                    <input className={`${styles.form_element} ${styles.short}`} type="text" id="city" value={invoice.clientAddress.city} onChange={(e)=>{setInvoice({...invoice, clientAddress: {...invoice.clientAddress, city: e.target.value}})}}></input>
                                </div>

                                <div className={`${mode.light ? styles.light : styles.dark}`}>
                                    <div className={`${mode.light ? styles.light : styles.dark}`}>
                                        <label htmlFor="post">Post Code</label> <label className={styles.error} htmlFor="post">{errors.clientAddress.postCode}</label>
                                    </div>
                                    <input className={`${styles.form_element} ${styles.short}`} type="text" id="post" value={invoice.clientAddress.postCode} onChange={(e)=>{setInvoice({...invoice, clientAddress: {...invoice.clientAddress, postCode: e.target.value}})}}></input>
                                </div>

                                <div className={`${mode.light ? styles.light : styles.dark}`}>
                                    <div className={`${mode.light ? styles.light : styles.dark}`}>
                                        <label htmlFor="country">Country</label> <label className={styles.error} htmlFor="country">{errors.clientAddress.country}</label>
                                    </div>
                                    <input className={`${styles.form_element} ${styles.short}`} type="text" id="country" value={invoice.clientAddress.country} onChange={(e)=>{setInvoice({...invoice, clientAddress: {...invoice.clientAddress, country: e.target.value}})}}></input>
                                </div>
                        </div>
                    </div>

                    <div className={`${mode.light ? styles.light : styles.dark}`}>
                        <div className={`${mode.light ? styles.light : styles.dark}`}>
                            <div className={`${mode.light ? styles.light : styles.dark}`}>
                                <label htmlFor="date">Invoice Date</label>
                                <input id="date" type="date" className={`${styles.form_element} ${styles.select}`} onChange={(e)=>{setInvoice({...invoice, createdAt: e.target.value})}} value={invoice.createdAt}/>
                            </div>
                            <div className={`${mode.light ? styles.light : styles.dark}`}>
                                <label htmlFor="select">Payment Terms</label>
                                <select id="select" className={`${styles.form_element} ${styles.select}`} value={payment} onChange={(e)=>{setPayment(e.target.value)}}>
                                    <option className="body_1" value="Net 1 Day">Net 1 Day</option>
                                    <option value="Net 7 Days">Net 7 Days</option>
                                    <option value="Net 14 Days">Net 14 Days</option>
                                    <option value="Net 30 Days">Net 30 Days</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={`${mode.light ? styles.light : styles.dark}`}>
                        <div className={`${mode.light ? styles.light : styles.dark}`}>
                            <label htmlFor="description"><p className="body_1">Projet Description</p></label> <label className={styles.error} htmlFor="description">{errors.description}</label>
                        </div>
                        <input className={`${styles.form_element} ${styles.long}`} type="text" id="description" value={invoice.description} onChange={(e)=>setInvoice({...invoice, description: e.target.value})}></input>
                    </div>
                        <div className={`${mode.light ? styles.light : styles.dark}`}></div>
                    <div className={`${mode.light ? styles.light : styles.dark} ${styles.items_title}`}>
                        <h2 className="h4">Item List</h2>
                    </div>

                    <div className={`${mode.light ? styles.light : styles.dark} ${styles.grid}`}>
                        <div className={`${mode.light ? styles.light : styles.dark} ${styles.grid_inner}`}>
                            <p>Item name</p>
                            <p>Qty</p>
                            <p>Price</p>
                            <p>Total</p>
                        </div>

                        {   
                            items ?
                                items.map((item, index, newItems, setNewItems)=>{

                                    return (
                                    <div className={`${mode.light ? styles.light : styles.dark} ${styles.grid_item}`}>
                                        <input className={`${styles.form_element} ${styles.items_long}`} type="text" id="item_name" value={items[index].name} onChange={(e)=>{changeItems(index, "name", e.target.value)}}></input>
                                        <input className={`${styles.form_element} ${styles.items_short}`} type="text" id="item_quantity" value={items[index].quantity} onChange={(e)=>{changeItems(index, "quantity", e.target.value)}}></input>
                                        <input className={`${styles.form_element} ${styles.items_medium}`} type="text" id="item_price" value={items[index].price} onChange={(e)=>{changeItems(index, "price", e.target.value)}}></input>
                                        <em className="h3_2">{items[index].total}</em>
                                        <img src={bin} tabindex="0" className={styles.pointer} onClick={()=>deleteItem(index)} alt="icon for deleting an item" />

                                    </div>
                                    )
                                })
                                :
                                null
                        }
                    </div>
                    <div className={`${mode.light ? styles.light : styles.dark}`}>
                        <button onClick={()=>changeItems(null, null, null, true)} className={`h3_2 ${mode.light ? 'btn_6' : 'btn_6_dark'}`}>+ Add New Item</button>
                    </div>
                    {
                        edit ?
                        <div className={`${mode.light ? styles.light : styles.dark} ${styles.buttons}`}> 
                            <button type="button" className="btn_1 h3_2" onClick={()=>{toggleForm(); setInvoice(invoiceConditional(edit)); setItems(itemsConditional(edit))}}>Cancel</button>
                            <button type="button" className={`${mode.light ? 'btn_4_light' : 'btn_4_dark'} h3_2`} onClick={(e)=>{e.preventDefault(); submit(false)}}>Save Change</button>
                        </div>
                        :
                        <div className={`${mode.light ? styles.light : styles.dark} ${styles.buttons}`}> 
                            <button type="button" className={`btn_1 h3_2 ${styles.discard} ${styles.cancel}`} onClick={()=>{toggleForm(); setInvoice(invoiceConditional(edit)); setItems(itemsConditional(edit))}}>Discard</button>
                            <button type="button" className={`${mode.light ? 'btn_4_light' : 'btn_4_dark'} h3_2`} onClick={(e)=>{e.preventDefault(); submit(true)}} >Save as Draft</button>
                            <button type="button" className={`btn_2 h3_2`} onClick={(e)=>{e.preventDefault(); submit(false)}}>Save &amp; Send</button>
                        </div>
                    }
                </div>
            </div>
            </form>
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
    toggleForm: () => dispatch(toggleForm()),
    editData: (data) => dispatch(editData(data))
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(InvoiceForm);
import {  useState } from "react";
import { useHistory } from "react-router";

import styles, {item_dark, item_light} from './invoices_item.module.scss'


const InvoicesItem = ({ invoice, index, mode }) => {

    const [history] = useState(useHistory())

    const link = () => {
        history.push(`id/${invoice.id}`)
    }
    return ( 
    <div className={`${styles.item} ${mode.light ? item_light : item_dark }`} onClick={()=>link()} tabIndex="0" >
        <div className={`h3_2 `}>
            <div className={`${mode.light ? styles.id__light : styles.id__dark}`}> <span className={styles.hash}>#</span> <h2 className={`h3_2 ${styles.h}`} >{invoice.id}</h2> </div>
        </div>
        <div className={`body_1 ${mode.light ? styles.due__light : styles.due__dark}`}>Due {invoice.paymentDue}</div>
        <div className={`body_1 ${mode.light ? styles.name__light : styles.name__dark}`}>{invoice.clientName}</div>
        <div className={`h3 ${mode.light ? styles.total__light : styles.total__dark}`}>£ {invoice.total}</div>
        <div className={`h3 ${styles.status} ${invoice.status==="pending" ? styles.status__pending : invoice.status==="paid" ? styles.status__paid : mode.light ? styles.status__draft__light : styles.status__draft__dark}`}> 
            <div className={`${invoice.status==="pending" ? styles.status__pending__text : invoice.status==="paid" ? styles.status__paid__text : mode.light ? styles.status__draft__text__light : styles.status__draft__text__dark}`}> 
                <h2 className="h3_2">{invoice.status}</h2>
            </div>
        </div>
        <div>
            <div className={styles.arrow}> </div>
        </div>
    </div>
    );
}
 
export default InvoicesItem;
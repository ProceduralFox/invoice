// import { useState } from "react";

// const Replication = () => {
//     const [text, setText] = useState({
//         first: "hello",
//         second: "bye"
//     })

//     function handleChange(value){
//         const text = {...text}

//         text.second = value

//         setText(text)
//     }

//     return (
//     <>
//         <p>TRYING TO REPLICATE ISSUE FROM MAIN COMPONENT</p>

//         <input type="text" 
//         value={text.second}
//         onChange={(e)=>{setText({
//             ...text,
//             second: e.target.value
//         })}}/>

//         <input type="text" 
//         value={text.second}
//         onChange={(e)=>{handleChange(e.target.value)}}/>

//     </> );
// }
 
// export default Replication;
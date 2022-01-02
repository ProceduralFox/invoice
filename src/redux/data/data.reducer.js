const INITIAL_STATE = {
}

const dataReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'SET_DATA':
            return action.payload

        case 'EDIT_DATA':
            const temp = {...state}
            temp[action.payload.id] = action.payload
            return temp
    default:
        return state
    }
}



export default dataReducer
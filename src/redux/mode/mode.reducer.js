import { modeSwitch } from "./mode.utils"


const INITIAL_STATE = {
    text: 'light',
    light: true,
    form: false
}



const modeReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){   
        case 'CHANGE_MODE': 
            return modeSwitch(state)

        case 'CHANGE_FORM':
            return {
                ...state,
                form: !state.form
            }

        default:
            return state
    }
}

export default modeReducer;

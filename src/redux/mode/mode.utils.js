export const modeSwitch = (state) => {
    const form = state.form

    if(state.light){
        return { text: 'dark', light: false, form: form}
    }
    return { text:'light', light: true, form: form}
}


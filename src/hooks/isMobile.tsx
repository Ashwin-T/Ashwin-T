
const isMobile = () => {

    let width = window.innerWidth;

    if(width <= 800){
        return true
    }
    return false

}

export default isMobile;
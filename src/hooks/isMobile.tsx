
const isMobile = () => {

    let width = window.innerWidth;

    if(width <= 768){
        return true
    }
    return false

}

export default isMobile;
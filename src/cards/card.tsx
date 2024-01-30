import { useRef } from "react";

const  debounce = (func :  () => void, timeout = 1000) =>{
    let timer : NodeJS.Timeout ;
    return () => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(null); }, timeout);
    };
  }

const Card = ({content, className, isSelected, handleCloseClick} : 
    {content:string; className? : string; isSelected : boolean; handleCloseClick : () => void}) => {

    const cardRef = useRef<HTMLDivElement>(null);
    
    const handleMouseEnter = (event : any) => {
        event.preventDefault();
    }

    const handleMouseLeave = (event : any) => {
        event.preventDefault();
    }

    return  <div className={`card ${className}`}  
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
                ref={cardRef}>
                    {content}
            </div>
}

export default Card;
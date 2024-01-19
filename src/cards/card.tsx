const Card = ({content, className, isSelected, handleCloseClick} : 
    {content:string; className : string; isSelected : boolean; handleCloseClick : () => void}) => {
    const handleMouseEnter = (event : any) => {
        event.preventDefault();
    }

    const handleMouseLeave = (event : any) => {
        event.preventDefault();
    }
    
    return <div className={`card ${className}`}  onMouseEnter={handleMouseEnter} 
    onMouseLeave={handleMouseLeave}>
        {isSelected && <div className="closeIcon" onClick={handleCloseClick}> X </div>}
        {content}
    </div>
}

export default Card;
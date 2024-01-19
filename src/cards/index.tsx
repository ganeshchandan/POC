import { Dispatch, SetStateAction, createContext, useState } from "react";
import Card from "./card";
import "./cards.scss";
import Canvas from "./canvas";

const CardContext = createContext<{selectedCard? : {
    selectedIndex : number;
    id : number;
    color : string;
    content : string;
},setSelectedCard? : Dispatch<SetStateAction<{
    selectedIndex : number; 
    id : number;
    color : string;
    content : string;
}>>}>({});

export type TSide = "none" | "left" | "right" | "both"

const contents = [{
    id : 0,
    color : "#0073e6",
    content : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries"
},
{
    id : 1,
    color : "#2991f5",
    content : "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English"
},{
    id : 2,
    color : "#e42616",
    content : "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur"
},
{
    id : 3,
    color : "#ceead6",
    content : "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English"
},
{
    id : 4,
    color : "#ee5143",
    content : "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English"
},
{
    id : 5,
    color : "#1fb254",
    content : "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English"
},{
    id : 6,
    color : "#202124",
    content : "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur"
}
];

const Cards = () => {

    const [selectedCard, setSelectedCard] = useState({selectedIndex : 0,
        id : 1,
        color : "#0073e6",
        content : "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries"
    });
    const [swipedLeftCard, setSwipedLeftCard] = useState(-1)
    const [side, setSide] = useState<TSide>("none")
    const {selectedIndex, color} = selectedCard;
    const [selectedCardNo , setSelectedCardNo] = useState(-1);
    const {color : nextColor =  "#0073e6" } = contents[(selectedIndex + 1) % contents.length];

    const handleSetSelectedCard = () => {
        setSide("both");
        setSwipedLeftCard(selectedIndex);
        setSelectedCard(() => {
            const index = (selectedIndex + 1) % contents.length;
            return {
                selectedIndex : index ,
                ...contents[index]
            }
        } )
    }

    const renderCards = () => {
        const length = contents.length;
        const secondIndex =  (selectedIndex + 1) % length;
        const thirdIndex =  (selectedIndex + 2) % length;
        return contents.map(({content}, index) => {
            let className = "";
            if(index === selectedCardNo){
                className = " selectedCard"
            } 
            
            // else if (closedCardNo === index){
            //     className = "deselectedCard";
            // } 
            
            else if(selectedIndex === index){
                className = `activeCard selectingCard_${side}`;
            } else if(secondIndex === index){
                className = "secondCard";
            } else if(thirdIndex === index){
                className = "thirdCard";
            } else if(swipedLeftCard === index){
                className = "lastCardSwip"
            }
            return <Card handleCloseClick = {handleCloseClick} content = {`${index} - ${content}`} key= {index} className={className} isSelected = {index === selectedCardNo}/>
        } )
    }

    const handleMouseEnter = (event : any) => {
        const {dataset} = event.target;
        const {side : datasetID} = dataset;
        if(side !== datasetID){
            setSide(() => datasetID);
        }
    }

    const handleMouseLeave = () => {
        setSide(() => "none");
    }

    const handleSetSelectedCardNo =() => {
        setSelectedCardNo(selectedIndex)
    }

    const handleCloseClick = () => {
        setSelectedCardNo(-1)
    }

    return <CardContext.Provider value={{selectedCard, setSelectedCard}}>
        <div className="cards" >
        {
            renderCards()
        }
        <div className={`showMeAndNextCard ${selectedCardNo !== -1 ? 'cardSelected' : ''}`}>
            <div className="nextCard" 
                onClick = {handleSetSelectedCard} 
                onMouseEnter={handleMouseEnter}
                onMouseOver={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                data-side = "left"
            >
                Next Card
            </div>
            <div className="showme" 
                onClick = {handleSetSelectedCardNo} 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
                data-side = "right"
            >
                Show me!
            </div>
        </div>
    </div>
    <Canvas side= {side} backgroundColor = {color} nextColor= {nextColor}/>
    </CardContext.Provider>
}

export default Cards;
import { deleteHotel,getAllHotel,postHotel,updateHotel } from "./api.js";
const nameInput=document.getElementById("tittle_input")
const roomInput=document.getElementById("room_input")
const visitInput=document.getElementById("visitors_input")
import{ 
    clearInputs,
    renderItemsList,
    getInputValues,
    EDIT_BUTTON_PREFIX,
    DELETE_BUTTON_PREFIX,
}from"./dom_util.js";
const formField = document.getElementById("item_form");
const submitButton=document.getElementById("submit_button")
const findButton=document.getElementById("find_button")
const cancelButton=document.getElementById("cancel_find_button")
const findInput=document.getElementById("find_input")
const itemsCounter = document.getElementById("items_counter");
const itemsSortASC = document.getElementById("sort_items_asc");
const itemsSortDESC = document.getElementById("sort_items_desc");
// const errorName = document.getElementById("errorName");
// const errorROOM = document.getElementById("errorRoom");
// const errorFind = document.getElementById("errorFind");

let hotel = [];

const onEditItem = async (e) => {
    const itemId = e.target.id.replace(EDIT_BUTTON_PREFIX, "");

    await updateHotel(itemId, getInputValues());

    clearInputs();

    refetchAllHotel();
};

const onDeleteItem = async(event) => {
    const hotelId = event.target.id.replace(DELETE_BUTTON_PREFIX, "")
    await     deleteHotel(hotelId);

    refetchAllHotel();
}

export const refetchAllHotel = async () => {
    const allHotels = await getAllHotel();
    hotel = allHotels.sort((a, b) => b.name.localeCompare(a.name));
 

    renderItemsList(hotel, onEditItem, onDeleteItem);
};
// const validateInput = () => { 
//     var letters = /^[A-Za-z]+$/;
//     if(formField.length.match(letters))
//     {
//     return true;
//     }
//     else    
//     {
//     alert('Username must have alphabetcharactersonly');
//     formField.focus();
//     return false;
//     }
// }
submitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const invaidSymbols = ["№", "<", ">", "/", "|", "\\", "#", "!", "~", "&", "$", "@", ";", ".", "?", "%", "*", "₴", "`"];

    if(nameInput.value == 0) {
        errorName.textContent = "Please enter a name";
    } else if(invaidSymbols.some(symbol => nameInput.value.includes(symbol))) {
        errorName.textContent = "Wrong symbols";
    } else if(roomInput.value.includes("&nbsp;") || roomInput.value.includes("&nbsp")) {
        errorROOM.textContent = "Anti-denys defence";
    } else if(typeof parseFloat(roomInput.value) != 'number') {
        errorROOM.textContent = "Please enter a valid numberrr";
    } else if(invaidSymbols.some(symbol => roomInput.value.includes(symbol)))  {
        errorROOM.textContent = "Wrong symbols";
    } else if(roomInput.value.search(/[A-Za-z]/) != -1) {
        errorROOM.textContent = "Wrong symbols";
    } else if(roomInput.value <= 0) {
        errorROOM.textContent = "Please enter a valid number";
    } else {
    
        const {  name, room, visitors } = getInputValues();
    
        clearInputs();
    
        postHotel({
            name, 
            room,
            visitors
        }).then(refetchAllHotel);}
    }); 

// submitButton.addEventListener("click", (event) => {

//     event.preventDefault();
//     const invaidSymbols = ["№", "<", ">", "/", "|", "\\", "#", "!", "~", "&", "$", "@", ";", ".", "?", "%", "*", "₴", "`"];

//     if(nameInput.value == 0) {
//         errorName.textContent = "Please enter a name";
//     } else if(invaidSymbols.some(symbol => nameInput.value.includes(symbol))) {
//         errorName.textContent = "Wrong symbols";
//     } else if(roomInput.value.includes("&nbsp;") || roomInput.value.includes("&nbsp")) {
//         errorROOM.textContent = "Anti-denys defence";
//     } else if(typeof parseFloat(roomInput.value) != 'number') {
//         errorROOM.textContent = "Please enter a valid numberrr";
//     } else if(invaidSymbols.some(symbol => roomInput.value.includes(symbol)))  {
//         errorROOM.textContent = "Wrong symbols";
//     } else if(roomInput.value.search(/[A-Za-z]/) != -1) {
//         errorROOM.textContent = "Wrong symbols";
//     } else if(roomInput.value <= 0) {
//         errorROOM.textContent = "Please enter a valid number";
//     } else {
//         const { name, room } = getInputValues();

//         clearInputs();

//         addItem({
//             name,
//             room: room.replace(',', '.'),
//         });
    
//         errorName.textContent = "";
//         errorROOM.textContent = "";
//     }

// });

itemsSortASC.addEventListener("click", (event) => {
    event.preventDefault();

    hotel.sort((a, b) => (a.room > b.room) ? 1 : -1);

    renderItemsList(hotel);
});

itemsSortDESC.addEventListener("click", (event) => {
    event.preventDefault();

    hotel.sort((a, b) => (a.room < b.room) ? 1 : -1);

    renderItemsList(hotel);
});

findButton.addEventListener("click", () => {
    const foundHotels = hotel.filter(
        (hotels) => hotels.name.search(findInput.value) !== -1
        );

    renderItemsList(foundHotels, onEditItem, onDeleteItem);
});

cancelButton.addEventListener("click", () => {
    renderItemsList(hotel,onEditItem,onDeleteItem);

    findInput.value = "";
});

refetchAllHotel();
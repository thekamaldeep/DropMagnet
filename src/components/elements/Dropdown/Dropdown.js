import { useState } from "react";
import "./Dropdown.css";

export default function Dropdown(props) {

  const [displayMenu, setDisplayMenu] = useState(false)
  const [selectedDropdownItem, setSelectedDropdownItem] = useState('')

  function showDropdownMenu() {
    setDisplayMenu(true)
  }

  function hideDropdownMenu(item) {
    setDisplayMenu(false)
    props.setSelected(item)
  }

  function renderDropDownItem(item) {
    return <div onClick={() => {setSelectedDropdownItem(item); hideDropdownMenu(item)}} className="dropdown-item">{item}</div>
  }

  let selectButtonStyle = displayMenu ? "main-dropdown-button-selected" : "main-dropdown-button"

  return (
    <div>
      <div className="text-field-title">{props.title}</div>
      <div className={selectButtonStyle} onClick={displayMenu ? hideDropdownMenu : showDropdownMenu}>
        <div>{selectedDropdownItem !== "" ? selectedDropdownItem : "Select"}</div>
        <img style={{objectFit: 'cover', paddingTop: '6px'}} width={14} height={8} src="./dropdown.png" />
      </div>

      { displayMenu ? (
        <div>
          {props.items.map(renderDropDownItem)}
        </div>
        ):
        (
          null
        )
      }
   </div>
  );
}
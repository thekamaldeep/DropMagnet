import React, { useState, useEffect } from 'react';
import DropCell from './DropCell/DropCell'

export default function DropList(props) {
  const [listItems, setListItems] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setListItems(props.drops)
  }, [props.drops])

  useEffect(() => {
    if (!isFetching) return;
    fetchMoreListItems();
  }, [isFetching]);

  function handleScroll() {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching) return;
    setIsFetching(true);
  }

  function fetchMoreListItems() {
    // setTimeout(() => {
      // setListItems(prevState => ([...prevState, ...Array.from(Array(20).keys(), n => n + prevState.length + 1)]));
      // setIsFetching(false);
    // }, 2000);
  }

  // Render functions

  function renderDropCell(drop) {
    return <DropCell style={{
      position: "absolute"
    }} key={drop.drop_id} drop={drop} />
  }

  return (
    <div style={{height: "800px", overflow: 'auto'}}>
      {listItems.map(renderDropCell)}
      {/* {isFetching && 'Fetching more list items...'} */}
    </div>
  );
};
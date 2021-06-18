import React, { useState } from "react";
import { useHistory, useLocation } from "react-router";
import styled from "styled-components";
import IntroScreen from "./intro_screen";
import { useSelector, useDispatch } from "react-redux";
import qs from "querystring";
import Tabs from "../home/tabs";

import Swiper from "../home/swiper";
import ProgressBar from "../home/progress-bar";
import RestartScreen from "./restart_screen";
import FinalFour from "./final_4";
import { cloneDeep } from "lodash";

import "./index.css";
import ReswipeComplete from "./complete_reswipe";

const MainContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 80px;
  flex-direction: column;
`;

const ReswipedButtonContainer = styled.div`
  margin-top: 20px;
`;

const Header = styled.div`
  align-self: flex-start;
  margin-top: 20px;
  margin-left: 20px;
  margin-bottom: auto;
`;

function Reswipe() {
  const history = useHistory();
  const dispatch = useDispatch();

  const [isReswipeStarted, setIsReswipeStarted] = useState(false);
  const curTab = qs.parse(useLocation().search, "?").tab;
  const [detailView, setDetailView] = useState(false);
  const [showRestartReSwipeMessage, setShowRestartReSwipeMessage] =
    useState(false);

  const [isFinal4Left, setIsFinal4Left] = useState(false);

  const tabList = ["arts", "music", "collectables", "fashion"];

  const { reswipeBucket } = useSelector((state) => {
    return state.category[curTab];
  });

  const [tempReswipeBucket, setTempReswipeBucket] = useState(reswipeBucket);

  const [currentCounter, setCurrentCounter] = useState(reswipeBucket.length);
  const [roundLength, setRoundLength] = useState(reswipeBucket.length);
  const [reswipeComplete, setReswipeComplete] = useState(false);
  const [deletedFinalFour, setDeletedFinalFour] = useState(null);

  console.log(reswipeBucket);
  const handleReswipe = (dir, drop_id) => {
    let newArray = tempReswipeBucket.filter(
      (value) => value.drop_id !== drop_id
    );
    let currCAndCurrL =  newArray.length;

    if (dir === "right") {
      currCAndCurrL +=1;
    } else {
      setTempReswipeBucket(newArray);
    }
    if (currentCounter - 1 === 0) {
      if(newArray.length === 0){
        return handleFinish();
      }
      setRoundLength(currCAndCurrL);
      setCurrentCounter(currCAndCurrL);
      setIsReswipeStarted(false);
      if (currCAndCurrL <= 4 ) {
        setDeletedFinalFour(new Array(currCAndCurrL).fill(false));
        setIsFinal4Left(true);
      } else {
        setShowRestartReSwipeMessage(true);
      }
    } else {
      setCurrentCounter(currentCounter - 1);
    }
  };

  const onChangeFinalFourDelete = (isDeleted, index) => {
    let newDeletedFinal4 = [...deletedFinalFour];
    newDeletedFinal4[index] = isDeleted;
    setDeletedFinalFour(newDeletedFinal4);
  };

  const handleFinish = () => {
    const currentReswipeBucket = cloneDeep(tempReswipeBucket);
    if (deletedFinalFour !== null) {
      deletedFinalFour.map((isDeleted, index) => {
        if (isDeleted) {
          currentReswipeBucket.splice(index, 1);
        }
      });
    }

    dispatch({type: 'SET_RESWIPE_BUCKET', payload: { newBucket: currentReswipeBucket, tab: curTab }})
    // API to save on the backend
    setTempReswipeBucket(currentReswipeBucket);
    setReswipeComplete(true);
  };

  //   console.log(reswipeBucket,selectionBucket);
  return (
    <MainContainer className={"container-reswipe"}>

      <Tabs
        activeTabIndex={tabList.indexOf(curTab)}
        handleActiveTabIndex={(index) =>{
          dispatch({type:'CLOSE_RESWIPE',payload: {tab: curTab}});
          history.push('/home');
        }}
        tabList={tabList}
      />
      {!reswipeComplete ? (
        <>
          {!isFinal4Left && !showRestartReSwipeMessage && !isReswipeStarted && (
            <IntroScreen />
          )}
          {showRestartReSwipeMessage && (
            <RestartScreen selectionCount={tempReswipeBucket.length} />
          )}
          {isFinal4Left && (
            <FinalFour
              deleted={deletedFinalFour}
              bucket={tempReswipeBucket}
              onChange={onChangeFinalFourDelete}
            />
          )}
          {isReswipeStarted && (
            <>
              <ProgressBar
                key="progressBar"
                size={roundLength}
                closeReswipe = {()=>{
                  dispatch({type:'CLOSE_RESWIPE',payload: {tab: curTab}});
                  history.push('/home');
                }}
                selectedCount={tempReswipeBucket.length}
              />
              <Swiper
                key={"a000"}
                reswipeModeActive={true}
                onReswipe={handleReswipe}
                db={tempReswipeBucket}
                detailView={detailView}
                setDetailView={setDetailView}
              />
            </>
          )}
        </>
      ) : <ReswipeComplete />
      }

      <ReswipedButtonContainer>
        {!reswipeComplete ? (
          <div style={{ display: "flex" }}>
            {!isFinal4Left && !showRestartReSwipeMessage && !isReswipeStarted && (
              <button
                className={"main-button-2 clickable"}
                onClick={() => setIsReswipeStarted(true)}
              >
                <h1 style={{ textAlign: "center", width: "300px" }}> Start </h1>
              </button>
            )}
            {showRestartReSwipeMessage && (
              <>
                <button
                  className={"main-button-2 clickable"}
                  onClick={handleFinish}
                >
                  <h1 style={{ textAlign: "center", width: "150px" }}>
                    I want {tempReswipeBucket.length}!
                  </h1>
                </button>
                <button
                  className={"main-button-2 clickable"}
                  onClick={() => {
                    setIsReswipeStarted(true);
                    setShowRestartReSwipeMessage(false);
                  }}
                >
                  <h1 style={{ textAlign: "center", width: "150px" }}>
                    Reswipe
                  </h1>
                </button>
              </>
            )}
            {isFinal4Left && (
              <>
                <button
                  className={"main-button-2 clickable"}
                  onClick={handleFinish}
                >
                  <h1 style={{ textAlign: "center", width: "150px" }}>SAVE</h1>
                </button>
              </>
            )}
          </div>
        ) : (
          <button className={"main-button-2 clickable"} onClick={()=>{
            dispatch({type:'CLOSE_RESWIPE',payload: {tab: curTab}});
            history.push("/home")
          }}>
            <h1 style={{ textAlign: "center", width: "100%" }}>Go To Collection Page</h1>
          </button>
        )}
      </ReswipedButtonContainer>
    </MainContainer>
  );
}

export default Reswipe;

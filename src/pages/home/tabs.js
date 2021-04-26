import styled from 'styled-components';

const TabsWrapper = styled.ul`
    display: flex;
    flex-direction: row;
    color: #ebeae8;
    padding: 10px;
    box-shadow: inset 0 1px 3px rgb(0 0 0 / 50%), inset 0 -1px 2px rgb(0 0 0 / 50%), inset 0 -3px 0 rgb(37 37 37 / 50%), inset 0 2px 4px rgb(0 0 0 / 50%), 0 3px 2px rgb(0 0 0 / 13%);
    border-radius: 22px;
    justify-content: space-evenly;
    background-clip: text;
    -webkit-background-clip: text;
    list-style: none;
    .tab-selected {
        background: linear-gradient( 135deg ,#239bae,#6d8ad7 41%,#9d6dd7 72%,#d76db2);
        background-clip: text;
        -moz-background-clip: text;
        -moz-text-fill-color: transparent;
        -webkit-text-fill-color: transparent;
        border: none;
        -webkit-background-clip: text;
    }
`;
const TabItem = styled.li`
    border: none;
    font-family: Quicksand;
    font-size: 16px;
    font-weight: 700;
    font-style: normal;
    letter-spacing: normal;
    line-height: normal;
    outline: none;
    cursor: pointer;
    background-clip: text;
    -webkit-background-clip: text;
`;
export default ({ activeIndex, handleActiveIndex, dataCollection }) => {
    return (
        <TabsWrapper>
            {dataCollection.map((tabItem, index) =>
                <TabItem 
                    key={index} 
                    onClick={() => handleActiveIndex(index)} 
                    className={activeIndex === index ? 'tab-selected' : ''}
                >{tabItem.title}</TabItem>
            )}
        </TabsWrapper>
    );
};

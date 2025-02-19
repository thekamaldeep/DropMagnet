import styled from "styled-components";
import LinksBtn from "../../components/blocks/links-btn";
import ConnectWalletBtn from "../../components/blocks/connect-wallet-btn";
import ColorText from "../../components/blocks/color-text";
import WalletHeader from "../../components/blocks/wallet-header";
import FixedHeader from "../../components/elements/HeaderBar/FixedHeader";

const WalletWrapper = styled.div`
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
`;
const NftDisplayWrapper = styled.div`
  margin-top: 70px;
  .nftHeader {
    padding: 16px;
    background: rgba(31, 31, 31, 1);
    display: flex;
    width: 100%;
    line-height: 70px;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  }
`;
const NftDisplayBottomSection = styled.div`
  max-width: 600px;
  background-color: rgb(18, 18, 18);
  color: var(--white);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  padding: 16px;
`;

const LinkSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  font-size: 18px;
  font-weight: 700;
  align-content: flex-start;
  justify-content: center;
  flex-wrap: wrap;
`;
const TldTitle = styled.div`
  color: rgba(242, 214, 0, 1);
  margin-bottom: 32px;
`;
const DisplayNftTitle = styled.div`
  color: var(--grayWhite);
  font-size: 33px;
  font-weight: 700;
  line-height: 21px;
  text-align: center;
  margin-bottom: 32px;
  div {
    margin-bottom: 6px;
  }
`;
const DisplayNftSubtitle = styled.div`
  color: var(--grayWhite);
  font-size: 29px;
  font-weight: 700;
  line-height: 21px;
  text-align: center;
  margin-bottom: 32px;
  div {
    margin-bottom: 6px;
  }
`;
const TldTagLine = styled.div`
  color: var(--grayWhite);
  font-size: 21px;
  font-weight: 700;
  line-height: 21px;
  text-align: center;
  margin-bottom: 32px;
  div {
    margin-bottom: 3px;
  }
`;

const NftDisplayPage = (props) => {
  return (
    <WalletWrapper>
      <FixedHeader {...props} />
      <NftDisplayWrapper>
        <WalletHeader />
        <NftDisplayBottomSection>
          <DisplayNftTitle> Display Your NFTs </DisplayNftTitle>
          <ColorText />
          <DisplayNftSubtitle>
            <div>And share with</div>
            <div>custom subdomains</div>
          </DisplayNftSubtitle>
          <ConnectWalletBtn style={{ marginBottom: "16px" }}>
            Connect Wallet
          </ConnectWalletBtn>
          <TldTagLine>
            <div>To create your unique</div>
            <div>custom domain from</div>
            <div>dozens of gTLDs in</div>
            <div>the Drop Magnet </div>
            <div>ecosystem.</div>
          </TldTagLine>
          <TldTitle>30+ gTLDs to choose from!</TldTitle>
          <LinkSection>
            <LinksBtn />
            <LinksBtn />
            <LinksBtn className="button-active" />
            <LinksBtn />
            <LinksBtn />
            <LinksBtn />
          </LinkSection>
        </NftDisplayBottomSection>
      </NftDisplayWrapper>
    </WalletWrapper>
  );
};

export default NftDisplayPage;

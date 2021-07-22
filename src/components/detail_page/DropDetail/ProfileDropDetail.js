import React from 'react'
import "./DropDetail.css"
import { formatDate } from '../../../helpers/DateFormatter'
import Avatar from '../../elements/Avatar/Avatar'
import { getInitials } from '../../../utils'

export default function ProfileDropDetail(props) {

  function closeDetail() {
    props.closeDetailView()
  }
  const { user } = props
  let artist_image = props.isSaved ? (props.drop.artist.avatar_url || ""):(user ? (user.avatar_url || ""): "")
  let artist_name = props.isSaved ? props.drop.artist.name: (user ? user.name: '')
  function renderMusicSideDetails() {
    return <div className="music-info-detail">
      <p2 style={{color: '#F5F5F5', opacity: '0.66', fontWeight: 'bold', transform: 'rotate(-90deg)', position: 'absolute', bottom: '24px', left: '8px', transformOrigin: '0 0', width: '164px'}} >30 Second Song Preview</p2>
    </div>
  }

  function renderPlayButton() {
    return <div className="play-button-icon">
      <img height={38} width={38} style={{paddingLeft: '4px'}} src="./play-icon.png" />
    </div>
  }


  const style = props.style || {};

  return (
    <div className="detail-view" style={style}>
      <div className="detail-view-header">
      <Avatar userImage={artist_image} style={{margin: 10}} initial={getInitials(artist_name, "")} view_only small />
    
        {/* <img className="detail-view-header-image" src={artist_image}/> */}
        <h1 className="drop-detail-title">{artist_name}</h1>
        <img className="close-detail-button close-button view-close-btn" style={{width: '39px', height: '39px',cursor: 'pointer'}} onClick={() => closeDetail()} src="./close-icon.png" />
      </div>

      {props.drop.media.length >1 ?
        <div className="drop-detail-image" style={{gridTemplateColumns: `repeat(${props.drop.media.length}, 195px)`}} onClick={() => props.handleClick()}>
        {props.drop.type === "music" ? renderMusicSideDetails() : <></>}
        {props.drop.type === "music" ? renderPlayButton() : <></>}
        {
          props.drop.media.map((img,index)=>{
            return(
              <img style={{height: '100%', width: '100%', borderRadius: '6px'}}  
                src={img.url} alt={'Cover'+index+'Photo'} />
              )
            })
        }
        
        </div>
        :
        <div className={'drop-detail-image-single'}>
          <img style={{height: '100%', width: '100%', borderRadius: '6px'}}  
                src={props.drop.media[0].url} alt={'Cover'+1+'Photo'} />
        </div>
      }
      
      <h1 className="drop-detail-title">{props.drop.title}</h1>
      <div style={{height: '1px', background: '#2F2F2F', margin: '12px 50px 0 50px'}} />
      <div className="drop-detail-holder" style={{marginTop: '12px'}}>
        <p2 className="drop-marketplace-title">{props.drop.marketplace}</p2>
        <p2 className="drop-category-title">{props.drop.category}</p2>
        <p2 className="drop-price"><span>Ξ</span> 
             {props.drop.price !== '' && props.drop.price!==undefined ? props.drop.price 
            : props.drop.auction_price && props.drop.auction_price!==undefined ? props.drop.auction_price 
            : 0}
        </p2>
      </div>
      <div className="drop-detail-holder" style={{marginTop: '0px'}}>
        {props.drop.drop_pieces !== undefined && <p2 className="drop-detail-piece-no">{props.drop.drop_pieces} Pieces</p2>}
        <p2 className="drop-detail-date">{formatDate(props.drop.drop_date,true)}</p2>
      </div>
      <div className="drop-description-holder">
        <p1 className="drop-detail-description-text">
          {props.drop.desc}
        </p1>
      </div>
    </div>
  );
}
